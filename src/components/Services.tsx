import { motion } from "motion/react";
import {
  HeartPulse,
  Stethoscope,
  Activity,
  ShieldPlus,
  CalendarCheck,
  Droplets,
  Syringe,
  TestTube2,
  ClipboardCheck,
  Scale,
  Zap,
  Heart,
  FlaskConical,
  Gauge,
  Microscope,
  Dna,
  Pill,
  Weight,
  UserRound,
} from "lucide-react";

export default function Services() {
  const services = [
    {
      title: "Primary Care",
      description:
        "Comprehensive medical care focusing on long-term health, wellness, and the management of acute and chronic conditions.",
      icon: Stethoscope,
    },
    {
      title: "Preventative Care",
      description:
        "Proactive health screenings, immunizations, and lifestyle guidance to identify risks and maintain long-term wellness.", // Preventative Care description update
      icon: ShieldPlus,
    },
    {
      title: "Annual Exams",
      description:
        "Thorough yearly physical examinations to monitor health status and detect potential issues early.",
      icon: CalendarCheck,
    },
    {
      title: "Women's Health Care",
      description:
        "Comprehensive primary care support for women, including routine screenings, pap smears, and pregnancy testing.", // Women's Health Care description update
      icon: UserRound, // Women's Health icon replacement
    },
    {
      title: "Diabetes Management",
      description:
        "Expert monitoring and treatment plans to help manage blood sugar levels and prevent complications.",
      icon: Droplets, // Diabetes icon replacement
    },
    {
      title: "Cholesterol Management",
      description:
        "Testing and personalized strategies to maintain healthy cholesterol levels and heart health.",
      icon: HeartPulse,
    },
    {
      title: "Vaccines",
      description:
        "Essential immunizations for adults to protect against preventable diseases.", // Vaccines description update
      icon: Syringe,
    },
    {
      title: "Blood Work",
      description:
        "On-site laboratory services for quick and accurate diagnostic testing and monitoring.",
      icon: TestTube2,
    },
    {
      title: "Pre-OP",
      description:
        "Comprehensive medical clearances and evaluations before surgical procedures.",
      icon: ClipboardCheck,
    },
    {
      title: "Weight Loss Management",
      description:
        "Medically supervised programs to help you achieve and maintain a healthy weight.",
      icon: Gauge, // Weight Loss icon correction: using Gauge as a body-weight scale dial
      externalHref: "https://liquidvmobile.com/weight-loss",
    },
    {
      title: "Pain Management",
      description:
        "Integrated approaches to treat and manage chronic pain for improved quality of life.",
      icon: Zap,
    },
    {
      title: "Chronic Disease Management",
      description:
        "Expert care for diabetes, hypertension, asthma, and other chronic conditions.",
      icon: Heart,
    },
    {
      title: "IV Therapy",
      description:
        "Intravenous hydration and nutrient therapy for optimal wellness and recovery.",
      icon: FlaskConical,
      externalHref: "https://liquidvmobile.com/iv-therapy",
    },
    {
      title: "Hypertension",
      description:
        "Specialized care for high blood pressure management to reduce cardiovascular risks.",
      icon: Activity, // Hypertension icon replacement
    },
    {
      title: "Peptides",
      description:
        "Advanced peptide therapies to optimize cellular function, enhance recovery, and support overall vitality.",
      icon: Pill, // Peptides icon replacement
      externalHref: "https://liquidvmobile.com/peptide-hormone",
    },
    {
      title: "Cancer Screening",
      description:
        "Early detection and comprehensive cancer screenings provided through NATERA for peace of mind.",
      icon: Microscope,
    },
    {
      title: "Hormone Replacement",
      description:
        "Personalized hormone replacement therapy using pellet technology for consistent and effective results.",
      icon: Dna,
      externalHref:"https://primarymedicalphysicians.com/services/evexias-hormone-pellet-therapy",
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
            From routine checkups to managing complex conditions, our team of 14
            providers offers a full spectrum of primary care services.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-6 sm:gap-8 reveal-stagger">
          {services.map((service) => {
            const isExternal = !!service.externalHref;
            const CardComponent = isExternal ? 'a' : 'div';
            const cardProps = isExternal 
              ? { href: service.externalHref, target: '_blank', rel: 'noopener noreferrer' } 
              : {};
              
            return (
              <CardComponent
                key={service.title}
                {...cardProps}
                onTouchStart={(e) => (e.currentTarget as HTMLElement).classList.add('is-pressed')}
                onTouchEnd={(e) => (e.currentTarget as HTMLElement).classList.remove('is-pressed')}
                onTouchCancel={(e) => (e.currentTarget as HTMLElement).classList.remove('is-pressed')}
                className="group p-6 sm:p-8 rounded-2xl sm:rounded-3xl bg-white/5 border border-white/10 hover:bg-accent-500 transition-all duration-300 cursor-pointer w-full md:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.5rem)] touch-manipulation [&.is-pressed]:bg-accent-500"
                style={{
                  backdropFilter: 'blur(8px)',
                  WebkitBackdropFilter: 'blur(8px)',
                  transform: 'translateZ(0)',
                  WebkitTransform: 'translateZ(0)'
                }}
              >
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-white/10 group-hover:bg-white [.is-pressed_&]:bg-white flex items-center justify-center mb-4 sm:mb-6 shadow-sm transition-colors duration-300">
                  <service.icon className="w-6 h-6 sm:w-7 sm:h-7 text-accent-400 group-hover:text-accent-500 [.is-pressed_&]:text-accent-500" />
                </div>
                <h4 className="text-lg sm:text-xl font-bold text-white group-hover:text-primary-900 [.is-pressed_&]:text-primary-900 mb-2 sm:mb-3 transition-colors duration-300">
                  {service.title}
                </h4>
                <p className="text-sm sm:text-base text-white/60 group-hover:text-primary-900/80 [.is-pressed_&]:text-primary-900/80 leading-relaxed transition-colors duration-300">
                  {service.description}
                </p>
              </CardComponent>
            );
          })}
        </div>
      </div>
    </section>
  );
}
