import React, { useState, useEffect, FormEvent } from 'react';
import { X, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface SpecialistIntakeModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialSpecialty: string;
}

const SPECIALTIES = [
  "Pulmonology",
  "Cardiology",
  "Gastroenterology",
  "Psychiatric care",
  "Podiatry",
  "DRE"
];

export default function SpecialistIntakeModal({ isOpen, onClose, initialSpecialty }: SpecialistIntakeModalProps) {
  const [specialty, setSpecialty] = useState(initialSpecialty);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [callbackTime, setCallbackTime] = useState('');
  const [consent, setConsent] = useState(false);
  const [company, setCompany] = useState(''); // honeypot
  
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  // Update specialty when modal opens with a new initialSpecialty
  useEffect(() => {
    if (isOpen) {
      // Map "Psychiatric Care" to "Psychiatric care" if needed to match backend exactly
      const mappedSpecialty = initialSpecialty === "Psychiatric Care" ? "Psychiatric care" : initialSpecialty;
      setSpecialty(mappedSpecialty);
      setStatus('idle');
      setName('');
      setPhone('');
      setEmail('');
      setCallbackTime('');
      setConsent(false);
      setCompany('');
    }
  }, [isOpen, initialSpecialty]);

  // Scroll lock handling for mobile/iPhone
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      const originalTouchAction = document.body.style.touchAction;
      
      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none'; // Prevent iOS background scroll
      
      // Handle ESC key
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
      };
      window.addEventListener('keydown', handleKeyDown);
      
      return () => {
        document.body.style.overflow = originalOverflow;
        document.body.style.touchAction = originalTouchAction;
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [isOpen, onClose]);

  // Full name validation: allow letters, spaces, hyphens, apostrophes. No numbers.
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[0-9]/g, '');
    setName(val);
  };

  // Phone validation: allow only digits, max 10
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 10);
    setPhone(val);
  };

  const formatPhone = (val: string) => {
    if (!val) return '';
    const match = val.match(/^(\d{0,3})(\d{0,3})(\d{0,4})$/);
    if (!match) return val;
    if (match[3]) return `(${match[1]}) ${match[2]}-${match[3]}`;
    if (match[2]) return `(${match[1]}) ${match[2]}`;
    if (match[1]) return `(${match[1]}`;
    return val;
  };

  // API submit logic
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (company) return; // Honeypot triggered
    
    if (phone.length < 10) {
      setStatus('error');
      setErrorMessage('Please enter a valid 10-digit phone number.');
      return;
    }

    const lastSubmit = localStorage.getItem('pmp_spec_cooldown');
    if (lastSubmit && Date.now() - parseInt(lastSubmit) < 30000) {
      setStatus('error');
      setErrorMessage('Please wait a moment before submitting again.');
      return;
    }

    setStatus('submitting');
    setErrorMessage('');

    try {
      const response = await fetch('https://pmp-intake-dev-f4g3a8bjgacae2fe.z01.azurefd.net/api/specialist-intake', {
        method: 'POST',
        mode: 'cors',
        credentials: 'omit',
        cache: 'no-store',
        referrerPolicy: 'no-referrer',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          specialty,
          name,
          phone: formatPhone(phone),
          email,
          callback_time: callbackTime || undefined
        })
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      localStorage.setItem('pmp_spec_cooldown', Date.now().toString());
      setStatus('success');
      
      setTimeout(() => {
        onClose();
      }, 2000);

    } catch (error) {
      setStatus('error');
      setErrorMessage('We couldn’t send your request right now. Please call the office.');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        /* Scoped modal markup/styles */
        <div 
          className="pmp-spec-overlay fixed inset-0 z-[100] flex items-center justify-center bg-[#0f172a]/80 backdrop-blur-sm" 
          style={{ 
            paddingTop: 'max(1rem, env(safe-area-inset-top))',
            paddingBottom: 'max(1rem, env(safe-area-inset-bottom))',
            paddingLeft: 'max(1rem, env(safe-area-inset-left))',
            paddingRight: 'max(1rem, env(safe-area-inset-right))'
          }}
          onClick={onClose}
        >
          {/* mobile/iPhone modal sizing and scroll fix */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="pmp-spec-modal relative w-full max-w-lg bg-[#0f172a] border border-[#29c1ac]/20 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
            style={{ maxHeight: '100%' }}
            onClick={e => e.stopPropagation()}
          >
            <div className="pmp-spec-header flex-none p-5 sm:p-6 border-b border-[#29c1ac]/10 flex justify-between items-center bg-[#0f172a] z-10">
              <h3 className="text-xl font-serif font-medium text-white">Specialist Intake</h3>
              <button 
                onClick={onClose}
                className="pmp-spec-close p-2 -mr-2 text-white/50 hover:text-white hover:bg-white/5 rounded-full transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="pmp-spec-body flex-1 overflow-y-auto p-5 sm:p-6 overscroll-contain" style={{ WebkitOverflowScrolling: 'touch' }}>
              
              <div className="pmp-spec-warning mb-6 p-4 rounded-xl bg-[#29c1ac]/10 border border-[#29c1ac]/20 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-[#29c1ac] shrink-0 mt-0.5" />
                <p className="text-sm text-[#29c1ac] leading-relaxed">
                  <strong>Do not include medical details.</strong> For emergencies call 911.
                </p>
              </div>

              {status === 'success' ? (
                <div className="pmp-spec-success flex flex-col items-center justify-center py-12 text-center">
                  <CheckCircle2 className="w-16 h-16 text-[#29c1ac] mb-4" />
                  <h4 className="text-xl font-medium text-white mb-2">Thank you!</h4>
                  <p className="text-white/70">We received your request and will contact you soon.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="pmp-spec-form space-y-5">
                  <input 
                    type="text" 
                    name="company" 
                    value={company} 
                    onChange={e => setCompany(e.target.value)} 
                    className="hidden" 
                    tabIndex={-1} 
                    autoComplete="off" 
                  />

                  <div className="pmp-spec-field">
                    <label className="block text-sm font-medium text-white/70 mb-1.5">Specialty</label>
                    <select 
                      value={specialty}
                      onChange={e => setSpecialty(e.target.value)}
                      required
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#29c1ac] focus:ring-1 focus:ring-[#29c1ac] transition-all appearance-none"
                    >
                      {SPECIALTIES.map(s => (
                        <option key={s} value={s} className="bg-[#0f172a] text-white">{s}</option>
                      ))}
                    </select>
                  </div>

                  <div className="pmp-spec-field">
                    <label className="block text-sm font-medium text-white/70 mb-1.5">Full Name *</label>
                    <input 
                      type="text" 
                      value={name}
                      onChange={handleNameChange}
                      required
                      placeholder="Jane Doe"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-[#29c1ac] focus:ring-1 focus:ring-[#29c1ac] transition-all"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="pmp-spec-field">
                      <label className="block text-sm font-medium text-white/70 mb-1.5">Phone *</label>
                      <input 
                        type="tel" 
                        value={formatPhone(phone)}
                        onChange={handlePhoneChange}
                        required
                        placeholder="(555) 123-4567"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-[#29c1ac] focus:ring-1 focus:ring-[#29c1ac] transition-all"
                      />
                    </div>

                    <div className="pmp-spec-field">
                      <label className="block text-sm font-medium text-white/70 mb-1.5">Email *</label>
                      <input 
                        type="email" 
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                        placeholder="jane@example.com"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-[#29c1ac] focus:ring-1 focus:ring-[#29c1ac] transition-all"
                      />
                    </div>
                  </div>

                  {/* callback-time dropdown replacement */}
                  <div className="pmp-spec-field">
                    <label className="block text-sm font-medium text-white/70 mb-1.5">Best time to call (Optional)</label>
                    <select 
                      value={callbackTime}
                      onChange={e => setCallbackTime(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#29c1ac] focus:ring-1 focus:ring-[#29c1ac] transition-all appearance-none"
                    >
                      <option value="" className="bg-[#0f172a] text-white/50">Select a time</option>
                      <option value="Preferred Morning" className="bg-[#0f172a] text-white">Preferred Morning</option>
                      <option value="Preferred Afternoon" className="bg-[#0f172a] text-white">Preferred Afternoon</option>
                    </select>
                  </div>

                  <div className="pmp-spec-consent pt-2">
                    <label className="flex items-start gap-3 cursor-pointer group">
                      <div className="relative flex items-center justify-center mt-0.5">
                        <input 
                          type="checkbox" 
                          checked={consent}
                          onChange={e => setConsent(e.target.checked)}
                          required
                          className="peer sr-only"
                        />
                        <div className="w-5 h-5 rounded border border-white/20 bg-white/5 peer-checked:bg-[#29c1ac] peer-checked:border-[#29c1ac] transition-all flex items-center justify-center">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#0f172a] opacity-0 peer-checked:opacity-100 transition-opacity" />
                        </div>
                      </div>
                      <span className="text-sm text-white/70 group-hover:text-white/90 transition-colors">
                        I understand I should not include sensitive medical details. *
                      </span>
                    </label>
                  </div>

                  {status === 'error' && (
                    <div className="pmp-spec-error text-red-400 text-sm mt-2">
                      {errorMessage}
                    </div>
                  )}

                  <div className="pmp-spec-actions pt-4 pb-2">
                    <button 
                      type="submit" 
                      disabled={status === 'submitting'}
                      className="w-full bg-[#29c1ac] hover:bg-[#29c1ac]/90 text-[#0f172a] font-bold py-4 rounded-xl transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {status === 'submitting' ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        'Submit Request'
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
