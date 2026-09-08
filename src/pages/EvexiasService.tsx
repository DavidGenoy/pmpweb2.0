import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2, HeartPulse, Activity, ShieldCheck, Stethoscope } from "lucide-react";

export default function EvexiasService() {
  useEffect(() => {
    document.title = "Dr. Moises Issa | EVEXIAS Hormone Pellet Therapy | Primary Medical Physicians";
    
    // Set meta description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', 'Explore EvexiPEL hormone pellet therapy with Dr. Moises Issa at Primary Medical Physicians in South Florida, in partnership with Liquid V Mobile. Learn about hormone optimization.');

    // Set canonical URL
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', 'https://primarymedicalphysicians.com/services/evexias-hormone-pellet-therapy');

    // Add JSON-LD Schema
    const schemaData = {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "EVEXIAS Hormone Pellet Therapy with Dr. Moises Issa",
      "description": "Explore EvexiPEL hormone pellet therapy with Dr. Moises Issa at Primary Medical Physicians in South Florida, in partnership with Liquid V Mobile.",
      "url": "https://primarymedicalphysicians.com/services/evexias-hormone-pellet-therapy",
      "provider": {
        "@type": "MedicalBusiness",
        "name": "Primary Medical Physicians",
        "url": "https://primarymedicalphysicians.com"
      },
      "about": {
        "@type": "Physician",
        "name": "Dr. Moises Issa"
      },
      "mentions": {
        "@type": "Organization",
        "name": "Liquid V Mobile",
        "url": "https://liquidvmobile.com/"
      },
      "mainEntity": {
        "@type": "MedicalSpecialty",
        "name": "Hormone Pellet Therapy",
        "description": "Bioidentical hormone replacement therapy utilizing EvexiPEL subcutaneous pellets for the treatment of hormonal imbalances."
      }
    };
    
    let script = document.querySelector('#evexias-schema');
    if (!script) {
      script = document.createElement('script');
      script.setAttribute('id', 'evexias-schema');
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

  const evexiasLink = "https://connect.evexi.as/?p_id=a11730c8-811e-45ab-82cb-2b27e1465354";

  const faqs = [
    {
      q: "Does Dr. Moises Issa offer EVEXIAS hormone pellet therapy?",
      a: "Yes, Dr. Moises Issa offers consultations for EVEXIAS hormone pellet therapy at Primary Medical Physicians in South Florida, evaluating whether this treatment aligns with your specific health needs."
    },
    {
      q: "What is EvexiPEL hormone pellet therapy?",
      a: "EvexiPEL is a form of bioidentical hormone replacement therapy (BHRT) that uses small, custom-compounded pellets inserted under the skin. These pellets are designed to release a steady stream of hormones over time."
    },
    {
      q: "What is Liquid V Mobile's relationship to EVEXIAS / EvexiPEL hormone therapy?",
      a: "Primary Medical Physicians works in partnership with Liquid V Mobile to provide additional information and access regarding EVEXIAS and EvexiPEL hormone therapy for our patients."
    },
    {
      q: "Can men and women discuss hormone optimization with Dr. Moises Issa?",
      a: "Yes. Both men and women experiencing symptoms of hormonal imbalance can schedule a consultation with Dr. Moises Issa. Eligibility and potential benefits depend on individual symptoms and lab results, which the physician will determine."
    },
    {
      q: "Do I need blood tests before hormone therapy?",
      a: "Absolutely. Comprehensive lab testing is a crucial step to evaluate your current hormone levels and determine if hormone optimization is clinically appropriate for you."
    },
    {
      q: "What are peptides?",
      a: "Peptides are short chains of amino acids, the same building blocks that make up proteins. Many peptides occur naturally in the body and act as signaling molecules involved in normal physiological processes. Certain peptides are also used or studied in medicine for specific purposes. At Primary Medical Physicians, any discussion of peptide-based treatment begins with an individualized medical evaluation to determine whether a particular option is clinically appropriate."
    },
    {
      q: "Is hormone pellet therapy right for everyone?",
      a: "No. Hormone pellet therapy requires individualized medical evaluation. Your physician will review your symptoms, health history, and risks to decide if it is a medically sound option for you."
    },
    {
      q: "Where can I receive EVEXIAS pellet therapy in South Florida?",
      a: "You can schedule a consultation with Dr. Moises Issa at Primary Medical Physicians, which operates multiple convenient locations across South Florida."
    },
    {
      q: "How can I schedule a consultation with Dr. Moises Issa?",
      a: "You can book an appointment by calling our office or using our online scheduling portal to discuss your symptoms and explore hormone optimization options."
    }
  ];

  return (
    <main className="min-h-screen pt-32 pb-16">
      {/* Combined Background Wrapper for Hero & Overview to soften transition */}
      <div className="relative">
        {/* Continuous background layer replacing the hard cut */}
        <div className="absolute inset-0 bg-gradient-to-b from-accent-500/5 via-accent-500/[0.02] to-transparent pointer-events-none" />
        
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-8 pb-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full mb-8 reveal-up">
              <span className="w-2 h-2 rounded-full bg-accent-500 animate-pulse" />
              <span className="text-sm font-medium tracking-wide uppercase text-white/80">Hormone Optimization</span>
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-medium mb-6 reveal-up leading-tight">
              EVEXIAS Hormone Pellet Therapy <br />
              <span className="text-accent-400 italic">with Dr. Moises Issa</span>
            </h1>
            <p className="text-lg md:text-xl text-white/70 max-w-3xl mx-auto mb-10 leading-relaxed reveal-up" style={{ animationDelay: '0.1s' }}>
              Discover if EvexiPEL bioidentical hormone replacement therapy is right for you. Dr. Moises Issa at Primary Medical Physicians provides comprehensive evaluations for personalized hormone optimization in South Florida, in partnership with Liquid V Mobile.
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-6 reveal-up" style={{ animationDelay: '0.2s' }}>
              <a
                href={evexiasLink}
                target="_blank"
                rel="sponsored noopener noreferrer"
                className="px-8 py-4 bg-accent-500 text-primary-950 rounded-full font-bold text-lg hover:bg-accent-400 transition-all hover:scale-105 active:scale-95 shadow-xl shadow-accent-500/20 w-full sm:w-auto flex items-center justify-center gap-2"
              >
                Explore EvexiPEL Hormone Therapy
                <ArrowRight className="w-5 h-5" />
              </a>
              <a
                href="https://healow.com/apps/provider/moises-issa-2847656"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 bg-white/10 text-white border border-white/20 rounded-full font-bold text-lg hover:bg-white/20 transition-all w-full sm:w-auto"
              >
                Schedule a Consultation
              </a>
            </div>
          </div>
        </section>

        {/* EVEXIAS & EvexiPEL Overview */}
        <section className="relative py-16 border-b border-white/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="reveal-up">
                <h2 className="text-3xl md:text-5xl font-serif font-medium mb-6">
                  What is <span className="text-accent-400 italic">EvexiPEL?</span>
                </h2>
                <div className="space-y-6 text-lg text-white/70 leading-relaxed">
                  <p>
                    EvexiPEL is a specific method of bioidentical hormone replacement therapy (BHRT) developed by EVEXIAS Health Solutions. It utilizes small, custom-compounded pellets that are placed subcutaneously (under the skin).
                  </p>
                  <p>
                    Unlike creams, patches, or pills that can cause fluctuating hormone levels, these pellets are designed to release a steady, consistent amount of hormones over a period of months. This approach aims to mimic the body's natural hormone delivery system.
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 reveal-stagger">
                {[
                  { icon: Activity, title: "Consistent Delivery", desc: "Designed to release hormones steadily over time." },
                  { icon: HeartPulse, title: "Bioidentical", desc: "Hormones structurally identical to those naturally produced." },
                  { icon: ShieldCheck, title: "Medical Evaluation", desc: "Requires careful physician assessment and lab testing." },
                  { icon: Stethoscope, title: "Personalized", desc: "Tailored to your specific clinical lab results and symptoms." }
                ].map((item, i) => (
                  <div key={i} className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/[0.08] transition-colors group">
                    <item.icon className="w-8 h-8 text-accent-500 mb-4 group-hover:scale-110 transition-transform" />
                    <h4 className="text-lg font-serif font-medium mb-2">{item.title}</h4>
                    <p className="text-sm text-white/50">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Dr. Moises Issa Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-12 items-center bg-white/5 border border-white/10 rounded-3xl p-8 md:p-12 reveal-up">
            <div className="w-full md:w-1/3 shrink-0">
              <div className="aspect-[3/4] rounded-2xl overflow-hidden border border-white/20 relative group">
                <img 
                  src="https://nethingso.xyz/providers/issa-profile.webp" 
                  alt="Dr. Moises Issa, EVEXIAS provider at Primary Medical Physicians" 
                  className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary-950 via-transparent to-transparent opacity-80" />
                <div className="absolute bottom-6 left-6 right-6">
                  <p className="text-white text-xl font-serif font-medium mb-1 drop-shadow-sm">Moises Issa</p>
                  <p className="text-accent-400 font-bold mb-1">F.A.C.S.G. MD</p>
                  <p className="text-white text-sm">Internal Medicine</p>
                </div>
              </div>
            </div>
            <div className="w-full md:w-2/3">
              <h2 className="text-3xl md:text-5xl font-serif font-medium mb-6">
                Consult with <span className="text-accent-400 italic">Moises Issa, MD</span>
              </h2>
              <div className="space-y-6 text-lg text-white/70 leading-relaxed mb-8">
                <p>
                  As part of the dedicated medical team at Primary Medical Physicians, <Link to="/providers/moises-issa-md" className="text-accent-400 hover:text-accent-300 underline underline-offset-4">Moises Issa, MD</Link> provides comprehensive evaluations for patients exploring hormone optimization. With extensive experience in internal medicine, Dr. Issa understands the complex role hormones play in overall health.
                </p>
                <p>
                  Whether you are seeking answers for unexplained fatigue, mood changes, or metabolic concerns, Dr. Issa approaches every patient with a thorough clinical perspective. If clinically appropriate, he offers EVEXIAS hormone pellet therapy as one potential pathway for treatment.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="https://healow.com/apps/provider/moises-issa-2847656"
                  target="_blank"
                  rel="noreferrer"
                  className="px-6 py-3 bg-white/10 text-white rounded-full font-bold text-center hover:bg-white/20 transition-all border border-white/20"
                >
                  Book with Dr. Moises Issa
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Liquid V Mobile Partnership */}
      <section className="py-16 bg-accent-500/5 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center reveal-up">
            <h2 className="text-3xl md:text-4xl font-serif font-medium mb-6">
              In Partnership with <span className="text-accent-400 italic">Liquid V Mobile</span>
            </h2>
            <p className="text-lg text-white/70 leading-relaxed mb-8">
              Primary Medical Physicians works in partnership with Liquid V Mobile. Through this collaboration, patients can access additional information and resources related to EVEXIAS and EvexiPEL hormone therapy. Liquid V Mobile works alongside our practice to expand patient education and access to hormone optimization options.
            </p>
            <a
              href="https://liquidvmobile.com/"
              target="_blank"
              rel="sponsored noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 border border-accent-500/50 text-accent-400 rounded-full font-bold text-lg hover:bg-accent-500 hover:text-primary-950 transition-all"
            >
              Visit Liquid V Mobile
              <ArrowRight className="w-5 h-5" />
            </a>
          </div>
        </div>
      </section>

      {/* Men and Women Section */}
      <section className="py-16 bg-white/[0.02] border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 reveal-up">
            <h2 className="text-3xl md:text-5xl font-serif font-medium mb-6">
              Hormone Optimization for <span className="text-accent-400 italic">Men & Women</span>
            </h2>
            <p className="text-lg text-white/70">
              Hormonal imbalances can affect anyone. Symptoms often develop gradually and may impact energy levels, mood, sleep, and physical well-being.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 reveal-stagger">
            <div className="glass-card p-8 rounded-3xl">
              <h3 className="text-2xl font-serif font-medium text-white mb-4">Therapy for Women</h3>
              <p className="text-white/70 leading-relaxed mb-6">
                Women experience significant hormonal shifts throughout their lives, especially during perimenopause and menopause. A careful evaluation can determine if bioidentical hormone replacement therapy might help address specific clinical symptoms resulting from these changes.
              </p>
            </div>
            <div className="glass-card p-8 rounded-3xl">
              <h3 className="text-2xl font-serif font-medium text-white mb-4">Therapy for Men</h3>
              <p className="text-white/70 leading-relaxed mb-6">
                Men may also experience declining hormone levels, such as testosterone, as they age. A thorough medical assessment by a physician can identify imbalances and determine if therapies like EvexiPEL are an appropriate medical option.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What to Expect */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 reveal-up">
            <h2 className="text-3xl md:text-5xl font-serif font-medium mb-6">
              What to Expect: <span className="text-accent-400 italic">The Process</span>
            </h2>
            <p className="text-lg text-white/70">
              Hormone therapy is a medical decision. Here is what a typical consultation journey looks like with Dr. Moises Issa.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 reveal-stagger">
            {[
              { 
                step: "01", 
                title: "Medical Consultation", 
                desc: "An in-depth discussion of your medical history, current symptoms, and overall health goals." 
              },
              { 
                step: "02", 
                title: "Comprehensive Lab Testing", 
                desc: "Blood tests are ordered to accurately evaluate your current hormone levels and baseline health." 
              },
              { 
                step: "03", 
                title: "Evaluation & Treatment Plan", 
                desc: "Dr. Moises Issa reviews your labs. If appropriate, a customized EvexiPEL treatment or peptide plan is recommended." 
              }
            ].map((item, i) => (
              <div key={i} className="relative p-8 rounded-3xl bg-white/5 border border-white/10">
                <span className="text-5xl font-serif text-accent-500/20 font-bold absolute top-6 right-6">{item.step}</span>
                <h4 className="text-xl font-serif font-medium mb-4 mt-8 relative z-10">{item.title}</h4>
                <p className="text-white/60 leading-relaxed relative z-10">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-white/[0.02] border-y border-white/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 reveal-up">
            <h2 className="text-3xl md:text-5xl font-serif font-medium mb-6">
              Frequently Asked <span className="text-accent-400 italic">Questions</span>
            </h2>
          </div>
          <div className="space-y-6 reveal-stagger">
            {faqs.map((faq, index) => (
              <div key={index} className="p-6 rounded-2xl bg-white/5 border border-white/10">
                <h3 className="text-lg font-bold text-white mb-3 flex gap-3">
                  <span className="text-accent-400 mt-1 shrink-0"><CheckCircle2 className="w-5 h-5" /></span>
                  {faq.q}
                </h3>
                <p className="text-white/70 leading-relaxed pl-8">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA & Disclaimer */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-accent-500/5" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center reveal-up">
          <h2 className="text-3xl md:text-5xl font-serif font-medium mb-8">
            Take the Next Step Toward <br />
            <span className="text-accent-400 italic">Hormone Optimization</span>
          </h2>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <a
              href={evexiasLink}
              target="_blank"
              rel="sponsored noopener noreferrer"
              className="px-8 py-4 bg-accent-500 text-primary-950 rounded-full font-bold text-lg hover:bg-accent-400 transition-all hover:scale-105 shadow-xl w-full sm:w-auto"
            >
              Learn More About EVEXIAS
            </a>
            <a
              href="https://liquidvmobile.com/"
              target="_blank"
              rel="sponsored noopener noreferrer"
              className="px-8 py-4 bg-white/10 text-white border border-white/20 rounded-full font-bold text-lg hover:bg-white/20 transition-all w-full sm:w-auto"
            >
              Visit Liquid V Mobile
            </a>
            <a
              href="https://healow.com/apps/provider/moises-issa-2847656"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 border border-white/20 rounded-full font-bold text-lg hover:bg-white/10 transition-all w-full sm:w-auto"
            >
              Schedule Consultation
            </a>
          </div>
          
          <div className="flex flex-wrap justify-center gap-4 mb-16 text-sm font-medium text-white/60">
            <Link to="/" className="hover:text-accent-400 transition-colors">Home</Link>
            <span>&bull;</span>
            <Link to="/#providers" className="hover:text-accent-400 transition-colors">Our Providers</Link>
            <span>&bull;</span>
            <Link to="/#locations" className="hover:text-accent-400 transition-colors">Our Locations</Link>
          </div>

          <div className="p-6 rounded-xl bg-primary-950/50 border border-white/10 text-left">
            <p className="text-xs text-white/50 leading-relaxed">
              <strong>Medical Disclaimer:</strong> The information provided on this page is for educational purposes only and does not constitute medical advice, diagnosis, or treatment. Hormone optimization and EVEXIAS/EvexiPEL therapies require an individualized medical evaluation. Potential benefits and risks should be discussed with your healthcare provider. Eligibility must be determined by a physician based on your medical history, symptoms, and clinical lab results. Results are not guaranteed.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
