import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Calendar, HeartPulse, Activity } from "lucide-react";

export default function ProviderMoisesIssa() {
  useEffect(() => {
    document.title = "Dr. Moises Issa, MD | Primary Medical Physicians";
    
    // Set meta description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', 'Meet Dr. Moises Issa, MD at Primary Medical Physicians in South Florida. Learn about his medical services, approach to patient care, hormone optimization consultations, and EVEXIAS/EvexiPEL therapy.');

    // Set canonical URL
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', 'https://primarymedicalphysicians.com/providers/moises-issa-md');

    // Add Open Graph tags
    const ogTags = [
      { property: 'og:title', content: 'Dr. Moises Issa, MD | Primary Medical Physicians' },
      { property: 'og:description', content: 'Meet Dr. Moises Issa, MD at Primary Medical Physicians in South Florida. Learn about his medical services, approach to patient care, hormone optimization consultations, and EVEXIAS/EvexiPEL therapy.' },
      { property: 'og:url', content: 'https://primarymedicalphysicians.com/providers/moises-issa-md' },
      { property: 'og:type', content: 'profile' },
      { property: 'og:image', content: 'https://nethingso.xyz/providers/issa_resized.webp' }
    ];

    ogTags.forEach(tag => {
      let el = document.querySelector(`meta[property="${tag.property}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute('property', tag.property);
        document.head.appendChild(el);
      }
      el.setAttribute('content', tag.content);
    });

    // Add JSON-LD Schema
    const schemaData = {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "mainEntity": {
        "@type": "Physician",
        "@id": "https://primarymedicalphysicians.com/providers/moises-issa-md#physician",
        "name": "Dr. Moises Issa",
        "url": "https://primarymedicalphysicians.com/providers/moises-issa-md",
        "image": "https://nethingso.xyz/providers/issa_resized.webp",
        "medicalSpecialty": [
          "Internal Medicine",
          "Geriatrics"
        ],
        "worksFor": {
          "@type": "MedicalOrganization",
          "name": "Primary Medical Physicians",
          "url": "https://primarymedicalphysicians.com"
        }
      }
    };
    
    let script = document.querySelector('#moises-issa-schema');
    if (!script) {
      script = document.createElement('script');
      script.setAttribute('id', 'moises-issa-schema');
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

  const healowLink = "https://healow.com/apps/provider/moises-issa-2847656";

  return (
    <main className="min-h-screen pt-32 pb-16">
      {/* Hero / Physician Identity */}
      <section className="relative overflow-hidden mb-16">
        <div className="absolute inset-0 bg-accent-500/5" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row gap-12 items-center bg-white/5 border border-white/10 rounded-3xl p-8 md:p-12 reveal-up">
            <div className="w-full md:w-1/3 shrink-0">
              <div className="aspect-[3/4] rounded-2xl overflow-hidden border border-white/20 relative group max-w-sm mx-auto">
                <img 
                  src="https://nethingso.xyz/providers/issa_resized.webp" 
                  alt="Dr. Moises Issa, MD at Primary Medical Physicians" 
                  className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary-950 via-transparent to-transparent opacity-80" />
                <div className="absolute bottom-6 left-6 right-6">
                  <p className="text-white text-xl font-serif font-medium mb-1 drop-shadow-sm">Dr. Moises Issa</p>
                  <p className="text-accent-400 font-bold mb-1">M.D., F.A.C.S.G.</p>
                  <p className="text-white text-sm">Internal Medicine - Geriatrics</p>
                </div>
              </div>
            </div>
            <div className="w-full md:w-2/3 text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full mb-6">
                <span className="w-2 h-2 rounded-full bg-accent-500 animate-pulse" />
                <span className="text-sm font-medium tracking-wide uppercase text-white/80">Primary Medical Physicians</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-medium mb-6 leading-tight">
                Dr. Moises Issa, MD
              </h1>
              <p className="text-lg text-white/70 leading-relaxed mb-8 max-w-2xl mx-auto md:mx-0">
                Dr. Moises Issa is a dedicated physician at Primary Medical Physicians in South Florida, specializing in Internal Medicine and Geriatrics. He is committed to providing comprehensive, compassionate care tailored to the unique needs of each patient.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <a
                  href={healowLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-8 py-4 bg-accent-500 text-primary-950 rounded-full font-bold text-lg hover:bg-accent-400 transition-all hover:scale-105 active:scale-95 shadow-xl flex items-center justify-center gap-2"
                >
                  Schedule with Dr. Moises Issa
                  <Calendar className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About & Areas of Care */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 reveal-up">
            <div>
              <h2 className="text-3xl font-serif font-medium mb-6">About Dr. Moises Issa</h2>
              <div className="space-y-4 text-lg text-white/70 leading-relaxed">
                <p>
                  As an integral part of the healthcare team at Primary Medical Physicians, Dr. Moises Issa focuses on delivering high-quality, patient-centered medical care. With a strong background in managing complex adult health conditions and the specific medical needs of older adults, his approach is rooted in careful listening and comprehensive clinical evaluation.
                </p>
                <p>
                  He believes in building long-lasting relationships with his patients, ensuring that every individual receives the personalized attention and modern medical guidance they deserve across South Florida.
                </p>
              </div>
            </div>
            
            <div>
              <h2 className="text-3xl font-serif font-medium mb-6">Areas of Care</h2>
              <div className="grid grid-cols-1 gap-4">
                <div className="p-6 rounded-2xl bg-white/5 border border-white/10 flex items-start gap-4">
                  <div className="p-3 bg-accent-500/10 rounded-xl text-accent-400 shrink-0">
                    <Activity className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">Internal Medicine</h3>
                    <p className="text-white/70">Comprehensive adult care, focusing on the diagnosis, treatment, and prevention of complex illnesses and chronic conditions.</p>
                  </div>
                </div>
                <div className="p-6 rounded-2xl bg-white/5 border border-white/10 flex items-start gap-4">
                  <div className="p-3 bg-accent-500/10 rounded-xl text-accent-400 shrink-0">
                    <HeartPulse className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">Geriatrics</h3>
                    <p className="text-white/70">Specialized medical care prioritizing the health, well-being, and unique clinical requirements of older adults.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Hormone Optimization & Liquid V Mobile */}
      <section className="py-16 bg-white/[0.02] border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center reveal-up">
            <h2 className="text-3xl md:text-4xl font-serif font-medium mb-6">
              Hormone Optimization with <span className="text-accent-400 italic">Dr. Moises Issa</span>
            </h2>
            <div className="space-y-6 text-lg text-white/70 leading-relaxed mb-10 text-left md:text-center">
              <p>
                In addition to his primary care services, Dr. Moises Issa provides medical consultations for appropriate patients exploring hormone optimization. After a thorough clinical evaluation and lab testing, he may discuss therapies such as EVEXIAS and EvexiPEL hormone pellet therapy.
              </p>
              <p>
                Primary Medical Physicians also works in partnership with Liquid V Mobile to expand patient education and access to these hormone optimization options.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link
                to="/services/evexias-hormone-pellet-therapy"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 text-white border border-white/20 rounded-full font-bold text-lg hover:bg-white/20 transition-all w-full sm:w-auto"
              >
                Explore EVEXIAS / EvexiPEL hormone therapy with Dr. Moises Issa
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Appointment CTA */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-accent-500/5" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center reveal-up">
          <h2 className="text-3xl md:text-5xl font-serif font-medium mb-8">
            Schedule an Appointment with <br />
            <span className="text-accent-400 italic">Dr. Moises Issa</span>
          </h2>
          <p className="text-lg text-white/70 mb-10 max-w-2xl mx-auto">
            Book your consultation today to discuss your health needs, preventive care, or specialized medical treatments.
          </p>
          <div className="flex justify-center mb-16">
            <a
              href={healowLink}
              target="_blank"
              rel="noopener noreferrer"
              className="px-10 py-4 bg-accent-500 text-primary-950 rounded-full font-bold text-lg hover:bg-accent-400 transition-all hover:scale-105 shadow-xl flex items-center justify-center gap-2 w-full sm:w-auto"
            >
              Schedule with Dr. Moises Issa
              <Calendar className="w-5 h-5" />
            </a>
          </div>
          
          <div className="p-6 rounded-xl bg-primary-950/50 border border-white/10 text-left max-w-3xl mx-auto">
            <p className="text-xs text-white/50 leading-relaxed">
              <strong>Medical Disclaimer:</strong> Suitability for hormone optimization and EVEXIAS / EvexiPEL therapy requires an individualized medical evaluation by a physician. The information on this page does not guarantee results, promise symptom improvement, or constitute medical advice. Potential benefits and risks should be discussed with your healthcare provider during your consultation.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
