import React, { useState, useEffect, FormEvent } from 'react';
import { X, Loader2, CheckCircle2, AlertCircle, Check } from 'lucide-react';
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
  const [dob, setDob] = useState(''); // added DOB field
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [pmpStatus, setPmpStatus] = useState(''); // added PMP patient-status dropdown
  const [specialistStatus, setSpecialistStatus] = useState(''); // added specialist patient-status dropdown
  const [reason, setReason] = useState(''); // added reason field
  const [appointmentDate, setAppointmentDate] = useState(''); // added specialist appointment date field
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
      setDob('');
      setPhone('');
      setEmail('');
      setPmpStatus('');
      setSpecialistStatus('');
      setReason('');
      setAppointmentDate('');
      setCallbackTime('');
      setConsent(false);
      setCompany('');
    }
  }, [isOpen, initialSpecialty]);

  // modal scroll container fix & background scroll lock while open
  useEffect(() => {
    if (isOpen) {
      const originalBodyOverflow = document.body.style.overflow;
      const originalHtmlOverflow = document.documentElement.style.overflow;
      
      // background scroll lock while open
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
      
      // Handle ESC key
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
      };
      window.addEventListener('keydown', handleKeyDown);
      
      return () => {
        // normal page scroll restoration on close
        document.body.style.overflow = originalBodyOverflow;
        document.documentElement.style.overflow = originalHtmlOverflow;
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

  // Date constraints for native date pickers
  const getLocalDateStr = (date: Date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  const today = new Date();
  const todayStr = getLocalDateStr(today);
  
  const minDobDate = new Date();
  minDobDate.setFullYear(today.getFullYear() - 100);
  const minDobStr = getLocalDateStr(minDobDate);

  const formatForApi = (dateStr: string) => {
    if (!dateStr) return undefined;
    const [year, month, day] = dateStr.split('-');
    if (year && month && day) return `${month}/${day}/${year}`;
    return dateStr;
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
      const response = await fetch('https://api.primarymedicalphysicians.com/api/specialist-intake', {
        method: 'POST',
        mode: 'cors',
        credentials: 'omit',
        cache: 'no-store',
        referrerPolicy: 'no-referrer',
        headers: {
          'Content-Type': 'application/json',
        },
        // submit payload extension
        body: JSON.stringify({
          specialty,
          name,
          dob: formatForApi(dob), // added DOB field
          phone: formatPhone(phone),
          email,
          pmp_status: pmpStatus, // added PMP patient-status dropdown
          specialist_status: specialistStatus, // added specialist patient-status dropdown
          reason_of_visit: reason, // added reason field
          specialist_appt_date: formatForApi(appointmentDate) || undefined, // added specialist appointment date field
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
          // desktop modal scroll containment fix (data-lenis-prevent)
          // mobile/iPhone modal scroll containment fix (overscroll-none)
          className="pmp-spec-overlay fixed inset-0 z-[100] flex items-center justify-center bg-[#0f172a]/80 backdrop-blur-sm overscroll-none" 
          data-lenis-prevent="true"
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
                <form onSubmit={handleSubmit} className="pmp-spec-form space-y-4">
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
                    {/* phone/iPhone fit adjustments: text-[13px] sm:text-sm */}
                    <label className="block text-[13px] sm:text-sm font-medium text-white/70 mb-1.5">Specialty</label>
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

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="pmp-spec-field">
                      <label className="block text-[13px] sm:text-sm font-medium text-white/70 mb-1.5">Full Name *</label>
                      <input 
                        type="text" 
                        value={name}
                        onChange={handleNameChange}
                        required
                        placeholder="Jane Doe"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-[#29c1ac] focus:ring-1 focus:ring-[#29c1ac] transition-all"
                      />
                    </div>

                    {/* DOB validation/date UI improvement */}
                    <div className="pmp-spec-field">
                      <label className="block text-[13px] sm:text-sm font-medium text-white/70 mb-1.5">Date of Birth *</label>
                      <input 
                        type="date" 
                        value={dob}
                        onChange={e => setDob(e.target.value)}
                        min={minDobStr}
                        max={todayStr}
                        required
                        // mobile date/calendar fit adjustments
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 sm:px-4 sm:py-3 text-[13px] sm:text-base text-white placeholder:text-white/20 focus:outline-none focus:border-[#29c1ac] focus:ring-1 focus:ring-[#29c1ac] transition-all [color-scheme:dark] appearance-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="pmp-spec-field">
                      <label className="block text-[13px] sm:text-sm font-medium text-white/70 mb-1.5">Phone *</label>
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
                      <label className="block text-[13px] sm:text-sm font-medium text-white/70 mb-1.5">Email *</label>
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

                  {/* status field layout change: full-width rows */}
                  <div className="pmp-spec-field">
                    <label className="block text-[13px] sm:text-sm font-medium text-white/70 mb-1.5">Primary Medical Physicians Status *</label>
                    <select 
                      value={pmpStatus}
                      onChange={e => setPmpStatus(e.target.value)}
                      required
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#29c1ac] focus:ring-1 focus:ring-[#29c1ac] transition-all appearance-none"
                    >
                      <option value="" className="bg-[#0f172a] text-white/50">Select status</option>
                      {/* updated dropdown labels/options */}
                      <option value="New Patient" className="bg-[#0f172a] text-white">New Patient</option>
                      <option value="Established Patient" className="bg-[#0f172a] text-white">Established Patient</option>
                    </select>
                  </div>

                  <div className="pmp-spec-field">
                    <label className="block text-[13px] sm:text-sm font-medium text-white/70 mb-1.5">Specialist Status *</label>
                    <select 
                      value={specialistStatus}
                      onChange={e => setSpecialistStatus(e.target.value)}
                      required
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#29c1ac] focus:ring-1 focus:ring-[#29c1ac] transition-all appearance-none"
                    >
                      <option value="" className="bg-[#0f172a] text-white/50">Select status</option>
                      {/* updated dropdown labels/options */}
                      <option value="New Patient" className="bg-[#0f172a] text-white">New Patient</option>
                      <option value="Established Patient" className="bg-[#0f172a] text-white">Established Patient</option>
                    </select>
                  </div>

                  <div className="pmp-spec-field">
                    <label className="block text-[13px] sm:text-sm font-medium text-white/70 mb-1.5">Reason of the visit *</label>
                    <textarea 
                      value={reason}
                      onChange={e => setReason(e.target.value)}
                      required
                      maxLength={160}
                      placeholder="Briefly describe the reason of the visit (maximum 160 characters)"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 sm:px-4 sm:py-3 text-[13px] sm:text-base text-white placeholder:text-white/20 focus:outline-none focus:border-[#29c1ac] focus:ring-1 focus:ring-[#29c1ac] transition-all resize-none h-24"
                    />
                  </div>

                  {/*<div className="grid grid-cols-1 sm:grid-cols-2 gap-4"></div> */}
                    {/* appointment-date future-date restriction */}
                    <div className="pmp-spec-field">
                      <label className="block text-[13px] sm:text-sm font-medium text-white/70 mb-1.5">Specialist Appointment Date (Optional)</label>
                      <input 
                        type="date" 
                        value={appointmentDate}
                        onChange={e => setAppointmentDate(e.target.value)}
                        min={todayStr}
                        // mobile date/calendar fit adjustments
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 sm:px-4 sm:py-3 text-[13px] sm:text-base text-white placeholder:text-white/20 focus:outline-none focus:border-[#29c1ac] focus:ring-1 focus:ring-[#29c1ac] transition-all [color-scheme:dark] appearance-none"
                      />
                    </div>

                    <div className="pmp-spec-field">
                      <label className="block text-[13px] sm:text-sm font-medium text-white/70 mb-1.5">Best time to call (Optional)</label>
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
                      <div className="relative flex items-center justify-center mt-0.5 shrink-0 w-5 h-5">
                        <input 
                          type="checkbox" 
                          checked={consent}
                          onChange={e => setConsent(e.target.checked)}
                          required
                          className="peer sr-only"
                        />
                        {/* checkbox style refinement */}
                        <div className="absolute inset-0 rounded border border-white/20 bg-white/5 peer-checked:bg-transparent peer-checked:border-[#29c1ac] transition-all"></div>
                        <Check className="absolute w-5 h-5 text-[#29c1ac] opacity-0 peer-checked:opacity-100 transition-all scale-125 -translate-y-0.5 translate-x-0.5" strokeWidth={3} />
                      </div>
                      <span className="text-[13px] sm:text-sm text-white/70 group-hover:text-white/90 transition-colors">
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
