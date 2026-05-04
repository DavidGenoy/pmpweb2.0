import { motion } from "motion/react";
import { Users, MapPin, Heart, Shield, Award, Sparkles } from "lucide-react";

export default function AboutUs() {
  return (
    <main className="bg-primary-950 text-white selection:bg-accent-500/30">
      {/* Hero Section - Premium Typography Focus */}
      <section className="relative min-h-[70vh] flex items-center pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-accent-500/10 blur-[120px] rounded-full" />
          <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-primary-500/10 blur-[100px] rounded-full" />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <span className="inline-block text-sm font-bold tracking-[0.3em] text-accent-400 uppercase mb-6">
                Our Legacy
              </span>
              <h1 className="text-5xl md:text-8xl font-serif font-medium leading-[1.1] mb-8 reveal-up">
                A Legacy of <span className="text-accent-400 italic">Compassionate</span> Care.
              </h1>
              <p className="text-xl md:text-2xl text-white/60 leading-relaxed max-w-2xl reveal-text-scrub">
                Primary Medical Physicians is dedicated to providing comprehensive, patient-centered healthcare across the Broward and Dade County communities.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section - Visual Rhythm */}
      <section className="py-24 border-y border-white/5 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-24 reveal-stagger">
            <div className="space-y-2">
              <span className="text-6xl md:text-8xl font-serif font-medium text-accent-500">15</span>
              <p className="text-sm font-bold tracking-widest text-white/40 uppercase">Expert Providers</p>
              <p className="text-white/60 text-sm leading-relaxed">A multidisciplinary team of dedicated medical professionals.</p>
            </div>
            <div className="space-y-2">
              <span className="text-6xl md:text-8xl font-serif font-medium text-accent-500">07</span>
              <p className="text-sm font-bold tracking-widest text-white/40 uppercase">Modern Locations</p>
              <p className="text-white/60 text-sm leading-relaxed">Strategically placed for maximum patient convenience.</p>
            </div>
            <div className="space-y-2">
              <span className="text-6xl md:text-8xl font-serif font-medium text-accent-500">10+</span>
              <p className="text-sm font-bold tracking-widest text-white/40 uppercase">Specialties On-Site</p>
              <p className="text-white/60 text-sm leading-relaxed">Comprehensive care without the need for external referrals.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section - Elegant Layout */}
      <section className="py-32 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="reveal-up">
              <h2 className="text-3xl md:text-5xl font-serif font-medium mb-8">
                Our Mission is Your <br />
                <span className="text-accent-400 italic">Well-being.</span>
              </h2>
              <div className="space-y-6 text-lg text-white/70 leading-relaxed">
                <p>
                  At Primary Medical Physicians, we believe that healthcare should be accessible, personalized, and deeply rooted in the community. Our journey began with a simple goal: to create a medical practice where patients feel seen, heard, and valued.
                </p>
                <p>
                  Today, we have grown into a premier healthcare network, but our core philosophy remains unchanged. We combine the latest medical advancements with a warm, human touch to ensure that every patient receives the highest standard of care.
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 reveal-stagger">
              {[
                { icon: Heart, title: "Patient-First", desc: "Every decision is guided by the best interests of our patients." },
                { icon: Shield, title: "Integrity", desc: "Maintaining the highest ethical standards in medical practice." },
                { icon: Award, title: "Excellence", desc: "Striving for clinical perfection in every diagnosis and treatment." },
                { icon: Sparkles, title: "Innovation", desc: "Embracing the latest advancements in medical science." }
              ].map((item, i) => (
                <div key={i} className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/[0.08] transition-colors group">
                  <item.icon className="w-8 h-8 text-accent-500 mb-6 group-hover:scale-110 transition-transform" />
                  <h4 className="text-xl font-serif font-medium mb-2">{item.title}</h4>
                  <p className="text-sm text-white/50 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* The Network Section - Specialist Partnerships */}
      <section className="py-32 bg-white/[0.02] border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-20 reveal-up">
            <span className="text-sm font-bold tracking-[0.3em] text-accent-400 uppercase mb-6 block">
              Integrated Care
            </span>
            <h2 className="text-4xl md:text-6xl font-serif font-medium mb-8">
              A Comprehensive <br />
              <span className="reveal-color italic">Specialist Network.</span>
            </h2>
            <p className="text-lg text-white/60">
              We have cultivated strategic partnerships with leading specialists to provide a seamless healthcare experience. From cardiology to dental surgery, our on-site services eliminate the complexity of modern medicine.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 reveal-stagger">
            {[
              "Pulmonology", "Cardiology", "Dental Surgery", "Gastroenterology",
              "Psychiatric Care", "Podiatry", "Retinal Exams", "Clinical Research"
            ].map((specialty, i) => (
              <div key={i} className="py-6 px-4 text-center border border-white/10 rounded-2xl hover:border-accent-500/50 transition-colors">
                <span className="text-sm font-medium text-white/80">{specialty}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Locations Section - Accessibility */}
      <section className="py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-20 reveal-up">
            <div className="max-w-2xl">
              <h2 className="text-4xl md:text-6xl font-serif font-medium mb-6">
                Accessible <br />
                <span className="reveal-color italic">Across the Region.</span>
              </h2>
              <p className="text-lg text-white/60">
                With 7 modern facilities across Broward and Dade County, expert medical care is always within reach.
              </p>
            </div>
            {/* Removal of "7 Locations" and "Broward & Dade" buttons as requested */}
          </div>

          {/* Centering the last row on desktop only using flex-wrap and justify-center */}
          <div className="flex flex-wrap justify-center gap-6 reveal-stagger">
            {[
              { name: "Hollywood Taft", url: "https://maps.app.goo.gl/wyLpLiDysZodzGH96" },
              { name: "Hollywood Johnson", url: "https://maps.app.goo.gl/cykjZd8Sat7HysHj7" },
              { name: "Pembroke Pines", url: "https://maps.app.goo.gl/jYy8nKjJT1ByxSwq7" },
              { name: "Davie Manor", url: "https://maps.app.goo.gl/REEL5UjBenHyC8BC7" },
              { name: "Davie", url: "https://maps.app.goo.gl/hTqVsDXbMJxnvVnh6" },
              { name: "Plantation", url: "https://maps.app.goo.gl/BNsxwvesa3HoRZjy7" },
              { name: "Aventura", url: "https://maps.app.goo.gl/7bX7q3JUDopi8ZAd9" }
            ].map((loc, i) => (
              <a 
                key={i} 
                href={loc.url}
                target="_blank"
                rel="noreferrer"
                /* About Us location link assignments: Reusing main page location URLs */
                /* Green interaction feedback addition: active:bg-accent-500 and active:scale-[0.98] for premium feel */
                className="glass-card p-8 rounded-3xl flex items-center justify-between group hover:bg-white/[0.08] active:bg-accent-500 active:scale-[0.98] transition-all duration-300 w-full md:w-[calc(50%-0.75rem)] lg:w-[calc(33.333%-1rem)] cursor-pointer"
              >
                <div>
                  <h4 className="text-xl font-serif font-medium group-active:text-primary-950 transition-colors">{loc.name}</h4>
                  <p className="text-sm text-white/40 group-active:text-primary-950/60 transition-colors">Primary Care Center</p>
                </div>
                <MapPin className="w-6 h-6 text-accent-500 group-active:text-primary-950 transition-colors" />
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - Final Impression */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-accent-500/5" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto text-center reveal-up">
            <h2 className="text-4xl md:text-7xl font-serif font-medium mb-12 leading-tight">
              Experience the Future of <br />
              <span className="text-accent-400 italic">Primary Care.</span>
            </h2>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <a 
                href="https://healow.com/apps/practice/primary-medical-physicians-llc-hollywood-fl-23412?v=2&t=1"
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto px-12 py-5 bg-accent-500 text-primary-950 rounded-full font-bold text-lg hover:bg-accent-400 transition-all hover:scale-105 active:scale-95 shadow-xl shadow-accent-500/20"
              >
                Book Appointment
              </a>
              <a 
                href="tel:9543999014"
                className="w-full sm:w-auto px-12 py-5 border border-white/20 rounded-full font-bold text-lg hover:bg-white/10 transition-all"
              >
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
