import { motion } from "motion/react";
import {
  HeartPulse,
  Stethoscope,
  Activity,
  ShieldPlus,
  Pill,
  Baby,
} from "lucide-react";

export default function Services() {
  const services = [
    {
      title: "Preventative Care",
      description:
        "Annual wellness exams, screenings, and immunizations to keep you healthy.",
      icon: ShieldPlus,
    },
    {
      title: "Chronic Disease Management",
      description:
        "Expert care for diabetes, hypertension, asthma, and other chronic conditions.",
      icon: Activity,
    },
    {
      title: "Women's Health",
      description:
        "Comprehensive care including Pap smears, breast exams, and family planning.",
      icon: HeartPulse,
    },
    {
      title: "Men's Health",
      description:
        "Prostate screenings, testosterone management, and general wellness.",
      icon: Stethoscope,
    },
    {
      title: "Pediatric Care",
      description:
        "Well-child visits, vaccinations, and sick visits for your little ones.",
      icon: Baby,
    },
    {
      title: "Medication Management",
      description:
        "Prescription refills, medication reviews, and pharmacy coordination.",
      icon: Pill,
    },
  ];

  return (
    <section id="services" className="py-32 bg-transparent relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 reveal-up">
          <h2 className="text-sm font-bold tracking-widest text-accent-400 uppercase mb-4">
            Our Services
          </h2>
          <h3 className="text-4xl md:text-5xl font-serif font-medium text-white mb-6">
            Comprehensive Care for Your Entire Family
          </h3>
          <p className="text-lg text-white/60 reveal-text-scrub">
            From routine checkups to managing complex conditions, our team of 16
            providers offers a full spectrum of primary care services.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 reveal-stagger">
          {services.map((service) => (
            <div
              key={service.title}
              className="group p-8 rounded-3xl bg-white/5 border border-white/10 hover:bg-accent-500 transition-all duration-300 cursor-pointer backdrop-blur-sm"
            >
              <div className="w-14 h-14 rounded-2xl bg-white/10 group-hover:bg-white flex items-center justify-center mb-6 shadow-sm transition-colors duration-300">
                <service.icon className="w-7 h-7 text-accent-400 group-hover:text-accent-500" />
              </div>
              <h4 className="text-xl font-bold text-white group-hover:text-primary-900 mb-3 transition-colors duration-300">
                {service.title}
              </h4>
              <p className="text-white/60 group-hover:text-primary-900/80 leading-relaxed transition-colors duration-300">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
