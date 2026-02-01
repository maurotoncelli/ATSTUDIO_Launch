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
    
    setTimeout(() => {
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
    }, 1500);
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
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-light text-[#f0f4ff] leading-tight tracking-tight" style={{ fontFamily: 'Playfair Display, serif' }}>
              Pilot Application
            </h2>
            <div className="h-px w-12 bg-[#a6c1ff]/30"></div>
            <p className="text-[#c7d2ff]/60 text-xs md:text-sm leading-relaxed tracking-wide hidden md:block">
              We are selecting 3 visionary partners for our Q2 2026 launch cycle. Tell us about your project.
            </p>
          </div>

          {/* Right: Form */}
          <div className="md:col-span-8">
            {submitStatus === 'success' ? (
              <div className="py-12 md:py-20 text-center md:text-left">
                <p className="text-xl md:text-2xl text-[#f0f4ff] font-light italic" style={{ fontFamily: 'Playfair Display, serif' }}>Application received.</p>
                <p className="text-[#c7d2ff]/60 text-sm md:text-sm mt-3 tracking-widest uppercase">We will contact you soon.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5 md:space-y-14 lg:space-y-20">
                {/* Row 1: Name + Email */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-5 md:gap-y-12 lg:gap-y-20">
                  <div className="relative">
                    <label className="block text-[10px] md:text-xs tracking-[0.15em] md:tracking-[0.2em] text-[#c7d2ff]/50 uppercase mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full bg-transparent border-b-2 md:border-b border-[#f0f4ff]/30 pb-4 text-[#f0f4ff] text-base md:text-base lg:text-lg focus:border-[#f0f4ff] outline-none transition-colors placeholder:text-[#c7d2ff]/20"
                      placeholder="John Doe"
                    />
                  </div>
                  <div className="relative">
                    <label className="block text-[10px] md:text-xs tracking-[0.15em] md:tracking-[0.2em] text-[#c7d2ff]/50 uppercase mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full bg-transparent border-b-2 md:border-b border-[#f0f4ff]/30 pb-2 md:pb-4 text-[#f0f4ff] text-sm md:text-base lg:text-lg focus:border-[#f0f4ff] outline-none transition-colors placeholder:text-[#c7d2ff]/20"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                {/* Row 2: Company + Website */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-5 md:gap-y-12 lg:gap-y-20">
                  <div className="relative">
                    <label className="block text-[10px] md:text-xs tracking-[0.15em] md:tracking-[0.2em] text-[#c7d2ff]/50 uppercase mb-2">
                      Company / Brand
                    </label>
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      className="w-full bg-transparent border-b-2 md:border-b border-[#f0f4ff]/30 pb-2 md:pb-4 text-[#f0f4ff] text-sm md:text-base lg:text-lg focus:border-[#f0f4ff] outline-none transition-colors placeholder:text-[#c7d2ff]/20"
                      placeholder="Acme Inc."
                    />
                  </div>
                  <div className="relative">
                    <label className="block text-[10px] md:text-xs tracking-[0.15em] md:tracking-[0.2em] text-[#c7d2ff]/50 uppercase mb-2">
                      Website URL
                    </label>
                    <input
                      type="url"
                      name="website"
                      value={formData.website}
                      onChange={handleChange}
                      className="w-full bg-transparent border-b-2 md:border-b border-[#f0f4ff]/30 pb-2 md:pb-4 text-[#f0f4ff] text-sm md:text-base lg:text-lg focus:border-[#f0f4ff] outline-none transition-colors placeholder:text-[#c7d2ff]/20"
                      placeholder="https://example.com"
                    />
                  </div>
                </div>

                {/* Row 3: Project Vision (full width) */}
                <div className="relative">
                  <label className="block text-[10px] md:text-xs tracking-[0.15em] md:tracking-[0.2em] text-[#c7d2ff]/50 uppercase mb-2">
                    Project Vision
                  </label>
                  <textarea
                    name="details"
                    value={formData.details}
                    onChange={handleChange}
                    rows={3}
                    className="w-full bg-transparent border-b-2 md:border-b border-[#f0f4ff]/30 pb-2 md:pb-4 text-[#f0f4ff] text-sm md:text-base lg:text-lg focus:border-[#f0f4ff] outline-none transition-colors resize-none placeholder:text-[#c7d2ff]/20 leading-relaxed"
                    placeholder="Tell us about your project..."
                  />
                </div>

                {/* Submit */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6 pt-2 md:pt-4 lg:pt-8">
                  <p className="text-[10px] text-[#c7d2ff]/30 tracking-[0.2em] uppercase max-w-[200px] hidden md:block">
                    Personalized consultation included for selected candidates.
                  </p>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="group relative px-8 md:px-12 lg:px-16 py-4 md:py-5 lg:py-6 border-2 md:border border-[#f0f4ff]/50 md:border-[#f0f4ff]/40 text-[#f0f4ff] text-sm md:text-sm lg:text-base tracking-[0.25em] md:tracking-[0.3em] font-medium md:font-light hover:border-[#f0f4ff] hover:bg-[#f0f4ff]/5 active:scale-95 transition-all duration-300 w-full md:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ fontFamily: 'Playfair Display, serif' }}
                  >
                    <span className="relative z-10">{isSubmitting ? 'Sending...' : 'Apply Now'}</span>
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
