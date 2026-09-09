import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, CheckCircle2, Award, GraduationCap, Building2, Stethoscope, BriefcaseMedical, ChevronDown } from "lucide-react";

export default function ProviderMoisesIssa() {
  const [openFaqs, setOpenFaqs] = useState<number[]>([]);

  const toggleFAQ = (index: number) => {
    setOpenFaqs((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  useEffect(() => {
    document.title = "Dr. Moises Issa, MD | Internal Medicine | Primary Medical Physicians";
    
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', 'Meet Dr. Moises Issa, MD, an Internal Medicine physician at Primary Medical Physicians serving South Florida, with a focus on adult primary care, healthy aging, clinical research and hormone optimization including EVEXIAS / EvexiPEL.');

    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', 'https://primarymedicalphysicians.com/providers/moises-issa-md');

    const schemaData = {
      "@context": "https://schema.org",
      "@type": "ProfilePage",
      "mainEntity": {
        "@type": "Person",
        "@id": "https://primarymedicalphysicians.com/providers/moises-issa-md#person",
        "name": "Moises Issa",
        "honorificPrefix": "Dr.",
        "honorificSuffix": "MD",
        "url": "https://primarymedicalphysicians.com/providers/moises-issa-md",
        "image": "https://nethingso.xyz/providers/issa-resized-hd.webp",
        "jobTitle": "Internal Medicine Physician",
        "worksFor": {
          "@type": "MedicalOrganization",
          "name": "Primary Medical Physicians",
          "url": "https://primarymedicalphysicians.com"
        },
        "alumniOf": [
          {
            "@type": "CollegeOrUniversity",
            "name": "Florida State University"
          },
          {
            "@type": "CollegeOrUniversity",
            "name": "Ross University School of Medicine"
          }
        ],
        "affiliation": [
          {
            "@type": "Organization",
            "name": "Liquid V LLC"
          }
        ]
      }
    };
    
    let script = document.querySelector('#provider-schema');
    if (!script) {
      script = document.createElement('script');
      script.setAttribute('id', 'provider-schema');
      script.setAttribute('type', 'application/ld+json');
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(schemaData);

    return () => {
      if (script) {
        document.head.removeChild(script);
      }
    };
  }, []);

  const faqs = [
    {
      q: "What type of doctor is Moises Issa?",
      a: "Dr. Moises Issa is an Internal Medicine physician at Primary Medical Physicians in South Florida. His practice focuses on comprehensive adult primary care, chronic-condition management and care addressing many of the health needs associated with aging."
    },
    {
      q: "Where does Dr. Moises Issa practice?",
      a: "Dr. Moises Issa practices with Primary Medical Physicians in South Florida. Patients can schedule an appointment through Primary Medical Physicians' online scheduling system."
    },
    {
      q: "Does Dr. Moises Issa offer hormone optimization?",
      a: "Dr. Issa is associated with Primary Medical Physicians' hormone optimization services, including consultations related to EVEXIAS / EvexiPEL hormone pellet therapy. Eligibility and treatment decisions require an individualized medical evaluation."
    },
    {
      q: "What is Dr. Moises Issa's relationship with Liquid V Mobile?",
      a: "Primary Medical Physicians works in partnership with Liquid V Mobile for its EVEXIAS / EvexiPEL hormone optimization services. Liquid V identifies Dr. Moises Issa, MD as Medical Director for Liquid V LLC."
    },
    {
      q: "Where did Dr. Moises Issa complete his medical training?",
      a: "Dr. Issa completed his undergraduate studies at Florida State University, earning a Bachelor of Science in Pre-Medicine/Pre-Medical Studies after attending from 1988 to 1992. He then attended Ross University School of Medicine from 1992 to 1996, where he earned his Doctor of Medicine degree. He subsequently completed an Internal Medicine Residency Program at Temple University from 1998 to 2001."
    }
  ];

  return (
    <main className="min-h-screen pt-32 pb-16">
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-accent-500/5 via-accent-500/[0.02] to-transparent pointer-events-none" />
        
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-8 pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            {/* Mobile / Tablet Header: Positioned above image */}
            <div className="lg:hidden text-center mb-6 sm:mb-8 reveal-up">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-medium mb-3 leading-tight text-white">
                Moises Issa, MD
              </h1>
              <p className="text-sm sm:text-base md:text-xl text-accent-400 font-medium max-w-xl mx-auto leading-snug">
                Internal Medicine | Geriatric-Focused Primary Care | Hormone Optimization
              </p>
            </div>

            <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-center lg:items-start">
              {/* Provider Image */}
              <div className="w-full lg:w-1/3 shrink-0 reveal-up flex justify-center">
                <div className="w-full max-w-[260px] sm:max-w-[280px] md:max-w-[320px] lg:max-w-none aspect-[3/4] rounded-2xl overflow-hidden border border-white/20 relative group shadow-2xl hover:border-accent-500/30 hover:shadow-[0_0_30px_rgba(2,195,154,0.15)] transition-all duration-300">
                  <img 
                    src="https://nethingso.xyz/providers/issa-resized-hd.webp" 
                    alt="Moises Issa, MD, Internal Medicine physician at Primary Medical Physicians" 
                    className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 sm:p-5 lg:p-6">
                    <p className="text-white font-serif text-xl sm:text-2xl font-medium">Moises Issa</p>
                    <p className="text-accent-400 font-medium text-xs sm:text-sm tracking-wide">MD F.A.C.S.G.</p>
                  </div>
                </div>
              </div>

              {/* Hero Content */}
              <div className="w-full lg:w-2/3 reveal-up text-center lg:text-left" style={{ animationDelay: '0.1s' }}>
                {/* Desktop Title & Specialty (Hidden on Mobile/Tablet to avoid duplication) */}
                <h1 className="hidden lg:block text-4xl md:text-5xl lg:text-6xl font-serif font-medium mb-4 leading-tight text-white">
                  Moises Issa, MD
                </h1>
                <p className="hidden lg:block text-xl md:text-2xl text-accent-400 font-medium mb-6">
                  Internal Medicine | Geriatric-Focused Primary Care | Hormone Optimization
                </p>

                {/* Badges */}
                <div className="flex flex-wrap justify-center lg:justify-start gap-2.5 sm:gap-3 mb-6 lg:mb-8">
                  <span className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-md text-xs sm:text-sm font-medium text-white/80">
                    Florida Licensed Physician Since 2001
                  </span>
                  <span className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-md text-xs sm:text-sm font-medium text-white/80">
                    Primary Medical Physicians
                  </span>
                </div>

                {/* Description */}
                <p className="text-base sm:text-lg text-white/80 leading-relaxed mb-8 lg:mb-10 max-w-3xl mx-auto lg:mx-0">
                  Dr. Moises Issa is an Internal Medicine physician at Primary Medical Physicians serving South Florida. His work spans comprehensive primary care, care focused on the health needs of older adults, chronic-disease management, clinical research and hormone optimization, including Primary Medical Physicians' EVEXIAS / EvexiPEL hormone therapy program offered in partnership with Liquid V Mobile.
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4 w-full">
                  <a
                    href="https://healow.com/apps/provider/moises-issa-2847656"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full max-w-[270px] sm:max-w-none sm:w-auto px-6 py-3 lg:px-8 lg:py-4 bg-accent-500 text-primary-950 rounded-full font-bold text-sm sm:text-base lg:text-lg hover:bg-accent-400 transition-all duration-200 ease-out hover:scale-[1.025] lg:hover:scale-105 active:scale-[0.97] shadow-lg shadow-accent-500/20 text-center touch-manipulation min-h-[44px] inline-flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400 focus-visible:ring-offset-2 focus-visible:ring-offset-primary-950"
                  >
                    Schedule Consultation
                  </a>
                  <Link
                    to="/services/evexias-hormone-pellet-therapy"
                    className="w-full max-w-[270px] sm:max-w-none sm:w-auto px-6 py-3 lg:px-8 lg:py-4 bg-white/10 text-white border border-white/20 rounded-full font-bold text-sm sm:text-base lg:text-lg hover:bg-white/20 transition-all duration-200 ease-out hover:scale-[1.025] lg:hover:scale-105 active:scale-[0.97] text-center touch-manipulation min-h-[44px] inline-flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400 focus-visible:ring-offset-2 focus-visible:ring-offset-primary-950"
                  >
                    View EVEXIAS Hormone Therapy
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* About & Clinical Focus Section */}
        <section className="py-16 border-b border-white/5 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
              <div className="reveal-up">
                <h2 className="text-3xl md:text-4xl font-serif font-medium mb-8">
                  About <span className="text-accent-400 italic">Dr. Moises Issa</span>
                </h2>
                <div className="space-y-6 text-lg text-white/70 leading-relaxed">
                  <p>
                    Moises Issa, MD, is an Internal Medicine physician at Primary Medical Physicians in South Florida, with a clinical focus on comprehensive adult primary care and the health needs of older adults. Licensed in Florida since 2001, Dr. Issa has built a career spanning primary care, chronic-disease management, clinical research, physician leadership, medical education and community service.
                  </p>
                  <p>
                    Dr. Issa began his academic training at Florida State University, where he completed a Bachelor of Science in Pre-Medicine/Pre-Medical Studies from 1988 to 1992. He then attended Ross University School of Medicine from 1992 to 1996, earning his Doctor of Medicine degree. He continued his postgraduate medical training at Temple University, completing an Internal Medicine Residency Program from 1998 to 2001.
                  </p>
                  <p>
                    Today, Dr. Issa practices with Primary Medical Physicians in South Florida. His professional work includes Internal Medicine and long-term adult primary care, with particular attention to chronic conditions, preventive care, healthy aging and individualized care planning.
                  </p>
                  <p>
                    Dr. Issa's approach to patient care emphasizes understanding each patient's medical history, risk factors, long-term health goals and quality of life. Treatment decisions are based on individualized medical evaluation and informed discussion of available options, potential benefits, risks and alternatives.
                  </p>
                </div>
              </div>

              <div className="reveal-up" style={{ animationDelay: '0.1s' }}>
                <h2 className="text-3xl md:text-4xl font-serif font-medium mb-8">
                  Internal Medicine & Comprehensive Adult Care
                </h2>
                <div className="p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-accent-500/30 hover:shadow-[0_0_20px_rgba(2,195,154,0.1)] transition-all duration-200 ease-out mb-8">
                  <Stethoscope className="w-10 h-10 text-accent-500 mb-6" />
                  <p className="text-lg text-white/80 leading-relaxed mb-6">
                    As an Internal Medicine physician, Dr. Issa provides comprehensive medical care for adults, including preventive care, chronic-condition management, medication management and long-term health planning. His practice also addresses many of the complex and evolving health needs that can accompany aging.
                  </p>
                  <ul className="space-y-4 text-white/70">
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-6 h-6 text-accent-500 shrink-0" />
                      <span>Comprehensive adult primary care and health screenings</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-6 h-6 text-accent-500 shrink-0" />
                      <span>Management of chronic medical conditions</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-6 h-6 text-accent-500 shrink-0" />
                      <span>Geriatric-focused care and healthy aging strategies</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-6 h-6 text-accent-500 shrink-0" />
                      <span>Individualized preventive care and medication management</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Professional Profile & Education Section */}
        <section className="py-16 border-b border-white/5 bg-black/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
              
              {/* Credentials Grid */}
              <div className="reveal-up">
                <h2 className="text-3xl md:text-4xl font-serif font-medium mb-8">
                  Professional Profile
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-6 rounded-xl bg-white/5 border border-white/10 hover:border-accent-500/30 hover:shadow-[0_0_20px_rgba(2,195,154,0.1)] transition-all duration-200 ease-out">
                    <BriefcaseMedical className="w-6 h-6 text-accent-500 mb-3" />
                    <p className="text-sm text-white/50 mb-1">Florida Medical License</p>
                    <p className="font-medium">ME81676</p>
                    <p className="text-xs text-white/40 mt-1">Status: Clear / Active</p>
                  </div>
                  <div className="p-6 rounded-xl bg-white/5 border border-white/10 hover:border-accent-500/30 hover:shadow-[0_0_20px_rgba(2,195,154,0.1)] transition-all duration-200 ease-out">
                    <Award className="w-6 h-6 text-accent-500 mb-3" />
                    <p className="text-sm text-white/50 mb-1">NPI Number</p>
                    <p className="font-medium">1558357780</p>
                    <p className="text-xs text-white/40 mt-1">Taxonomy: Internal Medicine</p>
                  </div>
                  <div className="p-6 rounded-xl bg-white/5 border border-white/10 hover:border-accent-500/30 hover:shadow-[0_0_20px_rgba(2,195,154,0.1)] transition-all duration-200 ease-out">
                    <Building2 className="w-6 h-6 text-accent-500 mb-3" />
                    <p className="text-sm text-white/50 mb-1">Practice</p>
                    <p className="font-medium">Primary Medical Physicians</p>
                  </div>
                  <div className="p-6 rounded-xl bg-white/5 border border-white/10 hover:border-accent-500/30 hover:shadow-[0_0_20px_rgba(2,195,154,0.1)] transition-all duration-200 ease-out">
                    <CheckCircle2 className="w-6 h-6 text-accent-500 mb-3" />
                    <p className="text-sm text-white/50 mb-1">Leadership</p>
                    <p className="font-medium">Medical Director</p>
                    <p className="text-xs text-white/40 mt-1">Liquid V LLC</p>
                  </div>
                </div>
              </div>

              {/* Education Timeline */}
              <div className="reveal-up" style={{ animationDelay: '0.1s' }}>
                <h2 className="text-3xl md:text-4xl font-serif font-medium mb-8">
                  Education & Medical Training
                </h2>
                <div className="space-y-6">
                  <div className="relative pl-8 border-l-2 border-white/10">
                    <span className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-accent-500 border-4 border-[#0a0a0a]" />
                    <p className="font-medium text-lg">Temple University — Pennsylvania</p>
                    <p className="text-accent-400">Internal Medicine Residency Program</p>
                    <p className="text-sm text-white/50 mt-1">1998–2001</p>
                  </div>
                  <div className="relative pl-8 border-l-2 border-white/10">
                    <span className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-accent-500 border-4 border-[#0a0a0a]" />
                    <p className="font-medium text-lg">Ross University School of Medicine</p>
                    <p className="text-accent-400">Doctor of Medicine (MD), Medicine</p>
                    <p className="text-sm text-white/50 mt-1">1992–1996</p>
                  </div>
                  <div className="relative pl-8 border-l-2 border-white/10">
                    <span className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-accent-500 border-4 border-[#0a0a0a]" />
                    <p className="font-medium text-lg">Florida State University</p>
                    <p className="text-accent-400">Bachelor of Science (BS), Pre-Medicine/Pre-Medical Studies</p>
                    <p className="text-sm text-white/50 mt-1">1988–1992</p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Hormone Optimization & Liquid V Mobile */}
        <section className="py-16 border-b border-white/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="reveal-up">
                <h2 className="text-3xl md:text-4xl font-serif font-medium mb-6">
                  Hormone Optimization & EVEXIAS / EvexiPEL
                </h2>
                <div className="space-y-6 text-lg text-white/70 leading-relaxed mb-8">
                  <p>
                    Dr. Moises Issa is associated with Primary Medical Physicians' hormone optimization program, including EVEXIAS / EvexiPEL hormone pellet therapy. Primary Medical Physicians offers consultations with Dr. Issa to evaluate whether hormone optimization may be appropriate based on a patient's symptoms, medical history, laboratory evaluation and individual health needs.
                  </p>
                  <div className="p-6 rounded-xl bg-white/5 border border-white/10 hover:border-accent-500/30 hover:shadow-[0_0_20px_rgba(2,195,154,0.1)] transition-all duration-200 ease-out">
                    <h3 className="text-white font-medium mb-2">Liquid V Mobile Partnership</h3>
                    <p className="text-base text-white/70">
                      Primary Medical Physicians provides its EVEXIAS / EvexiPEL hormone therapy services in partnership with <a href="https://liquidvmobile.com/" target="_blank" rel="noopener noreferrer" className="text-accent-400 hover:text-accent-300 underline underline-offset-4 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent-400 rounded">Liquid V Mobile</a>. Liquid V identifies Dr. Moises Issa, MD as Medical Director for Liquid V LLC.
                    </p>
                  </div>
                </div>
                <Link
                  to="/services/evexias-hormone-pellet-therapy"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-accent-500/10 text-accent-400 border border-accent-500/20 rounded-full font-medium hover:bg-accent-500/20 hover:scale-[1.025] active:scale-[0.97] transition-all duration-200 ease-out touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400 focus-visible:ring-offset-2 focus-visible:ring-offset-primary-950 group"
                >
                  Learn About EVEXIAS / EvexiPEL Hormone Therapy
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
                </Link>
              </div>
              <div className="grid gap-6 reveal-up" style={{ animationDelay: '0.1s' }}>
                <div className="p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-accent-500/30 hover:shadow-[0_0_20px_rgba(2,195,154,0.1)] transition-all duration-200 ease-out">
                  <h3 className="text-2xl font-serif font-medium mb-4">Clinical Research & Medical Education</h3>
                  <p className="text-white/70 leading-relaxed">
                    Dr. Issa's professional activities extend into medical education and clinical research. Florida State University College of Medicine has listed him as an assistant clinical professor, and ClinicalTrials.gov identifies Moises Issa as a principal investigator at Zenith Clinical Research in Hollywood, Florida, for clinical research activity.
                  </p>
                </div>
                <div className="p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-accent-500/30 hover:shadow-[0_0_20px_rgba(2,195,154,0.1)] transition-all duration-200 ease-out">
                  <h3 className="text-2xl font-serif font-medium mb-4">Community Involvement</h3>
                  <p className="text-white/70 leading-relaxed">
                    His community involvement has included service with the Broward County Chapter of the American Red Cross, where he has previously served in board leadership roles.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQs Section */}
        <section className="py-24 relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent-500/10 blur-[120px] rounded-full pointer-events-none" />
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-16 reveal-up">
              <h2 className="text-sm font-bold tracking-widest text-accent-400 uppercase mb-4">
                Common Questions
              </h2>
              <h3 className="text-3xl md:text-5xl font-serif font-medium">
                Frequently Asked Questions
              </h3>
            </div>
            
            <div className="space-y-4 sm:space-y-5 reveal-up" style={{ animationDelay: '0.1s' }}>
              {faqs.map((faq, i) => {
                const isOpen = openFaqs.includes(i);
                return (
                  <div 
                    key={i} 
                    className={`rounded-2xl transition-all duration-200 ease-out border ${
                      isOpen 
                        ? "bg-white/[0.08] border-accent-500/40 shadow-[0_0_25px_rgba(2,195,154,0.12)]" 
                        : "bg-white/5 border-white/10 hover:border-accent-500/30 hover:bg-white/[0.07] hover:shadow-[0_0_20px_rgba(2,195,154,0.08)]"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => toggleFAQ(i)}
                      aria-expanded={isOpen}
                      aria-controls={`faq-answer-${i}`}
                      id={`faq-question-${i}`}
                      className="w-full text-left p-5 sm:p-6 lg:p-7 flex items-center justify-between gap-4 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400 focus-visible:ring-offset-2 focus-visible:ring-offset-primary-950 rounded-2xl select-none group touch-manipulation active:scale-[0.99] transition-transform duration-150"
                    >
                      <h4 className="text-base sm:text-lg lg:text-xl font-medium text-white group-hover:text-accent-300 transition-colors pr-2">
                        {faq.q}
                      </h4>
                      <div 
                        className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center border transition-all duration-200 ease-out ${
                          isOpen 
                            ? "bg-accent-500 text-primary-950 border-accent-500 rotate-180 shadow-[0_0_12px_rgba(2,195,154,0.35)]" 
                            : "bg-white/10 border-white/15 text-white/70 group-hover:border-accent-500/40 group-hover:text-accent-400 group-hover:bg-accent-500/10"
                        }`}
                      >
                        <ChevronDown className="w-4 h-4 transition-transform duration-200" />
                      </div>
                    </button>
                    
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          id={`faq-answer-${i}`}
                          role="region"
                          aria-labelledby={`faq-question-${i}`}
                          key={`faq-content-${i}`}
                          initial={{ height: 0, opacity: 0, y: -6 }}
                          animate={{ height: "auto", opacity: 1, y: 0 }}
                          exit={{ height: 0, opacity: 0, y: -4 }}
                          transition={{ 
                            duration: 0.24, 
                            ease: [0.16, 1, 0.3, 1] 
                          }}
                          className="overflow-hidden"
                        >
                          <div className="px-5 pb-5 sm:px-6 sm:pb-6 lg:px-7 lg:pb-7 pt-1 border-t border-white/10 mt-1">
                            <p className="text-white/75 leading-relaxed text-sm sm:text-base lg:text-lg pt-3">
                              {faq.a}
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-16 text-center border-t border-white/5 bg-black/40">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 reveal-up">
            <h2 className="text-3xl md:text-4xl font-serif font-medium mb-6">
              Schedule an Appointment with Dr. Issa
            </h2>
            <p className="text-lg text-white/70 mb-8">
              Take the next step in managing your health or exploring hormone optimization with an individualized consultation.
            </p>
            <a
              href="https://healow.com/apps/provider/moises-issa-2847656"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 sm:px-8 sm:py-4 bg-accent-500 text-primary-950 rounded-full font-bold text-base sm:text-lg hover:bg-accent-400 transition-all duration-200 ease-out hover:scale-[1.025] active:scale-[0.97] shadow-xl shadow-accent-500/20 touch-manipulation min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400 focus-visible:ring-offset-2 focus-visible:ring-offset-primary-950"
            >
              Schedule Consultation via Healow
              <ArrowRight className="w-5 h-5" />
            </a>
          </div>
        </section>

      </div>
    </main>
  );
}
