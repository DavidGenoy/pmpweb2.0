import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Activity, Scale, Brain, Moon, Heart } from 'lucide-react';

export default function BHRTSection() {
  const [activeSymptoms, setActiveSymptoms] = useState<string[]>([]);

  const symptoms = [
    {
      id: 'fatigue',
      icon: <Activity className="w-[18px] h-[18px]" />,
      title: 'Unusual fatigue',
      desc: 'Low energy or motivation that feels different',
    },
    {
      id: 'weight',
      icon: <Scale className="w-[18px] h-[18px]" />,
      title: 'Weight changes',
      desc: 'Especially stubborn belly weight',
    },
    {
      id: 'brain',
      icon: <Brain className="w-[18px] h-[18px]" />,
      title: 'Brain fog',
      desc: 'Difficulty focusing, remembering, or feeling clear',
    },
    {
      id: 'sleep',
      icon: <Moon className="w-[18px] h-[18px]" />,
      title: 'Poor sleep',
      desc: 'Trouble falling asleep or staying asleep',
    },
    {
      id: 'mood',
      icon: <Heart className="w-[18px] h-[18px]" />,
      title: 'Mood or libido changes',
      desc: 'Feeling emotionally different or less connected',
    },
  ];

  const toggleSymptom = (id: string) => {
    setActiveSymptoms((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const activeCount = activeSymptoms.length;
  const progressDeg = Math.min(activeCount / symptoms.length, 1) * 360;

  let signalTitle = 'Start with what you notice';
  let signalText = 'Tap any symptoms below to personalize the next step.';
  if (activeCount === 1) {
    signalTitle = '1 signal selected';
    signalText = 'Even a single symptom can be a sign of hormone changes. Keep selecting anything that feels familiar.';
  } else if (activeCount > 1) {
    signalTitle = `${activeCount} signals selected`;
    signalText = 'When symptoms overlap, it may be worth discussing hormone health with a trained provider.';
  }

  const scrollToListen = () => {
    document.getElementById('listenSection')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <section className="bhrt-wrapper font-sans">
      <style>{`
        .bhrt-wrapper {
          --navy: #0a2540;
          --deep-navy: #0a1628;
          --teal: #4ecdc4;
          --soft-teal: #7ee8e2;
          --blue-green: #1a5c6e;
          --cream: #f8f6f1;
          --text-primary: #0a2540;
          --text-secondary: #64707b;
          --border-soft: rgba(26, 92, 110, 0.12);
        }
        .bhrt-s1 {
          background: linear-gradient(160deg, #0a2540 0%, #0d3b5e 60%, #1a5c6e 100%);
          padding: 48px 24px 56px;
          position: relative;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        @media (min-width: 1024px) {
          .bhrt-s1 { padding: 80px 5vw; justify-content: center; }
        }
        .bhrt-s1::before {
          content: '';
          position: absolute;
          width: 300px;
          height: 300px;
          border-radius: 50%;
          border: 1px solid rgba(255,255,255,0.06);
          top: -100px;
          right: -100px;
        }
        .bhrt-s1::after {
          content: '';
          position: absolute;
          width: 200px;
          height: 200px;
          border-radius: 50%;
          border: 1px solid rgba(255,255,255,0.08);
          bottom: -50px;
          left: -50px;
        }
        .bhrt-s2 {
          position: relative;
          overflow: hidden;
          padding: 48px 24px 40px;
          background: radial-gradient(circle at 88% 8%, rgba(78, 205, 196, 0.26), transparent 28%), linear-gradient(180deg, #fbfaf6 0%, #f3f7f6 100%);
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        @media (min-width: 1024px) {
          .bhrt-s2 { padding: 80px 5vw; justify-content: center; }
        }
        .bhrt-s2::before {
          content: "";
          position: absolute;
          inset: 24px 24px auto auto;
          width: 120px;
          height: 120px;
          border: 1px solid rgba(26, 92, 110, 0.1);
          border-radius: 999px;
          pointer-events: none;
        }
        .bhrt-signal-ring {
          background: conic-gradient(var(--teal) var(--progress, 0deg), #e5eeef 0deg);
          transition: background 0.25s ease;
        }
        .bhrt-symptom-row {
          transition: transform 0.18s ease, border-color 0.18s ease, background 0.18s ease, box-shadow 0.18s ease;
        }
        .bhrt-symptom-row:active { transform: scale(0.985); }
        .bhrt-symptom-row.active {
          background: var(--navy);
          border-color: var(--navy);
          box-shadow: 0 13px 26px rgba(10,37,64,0.16);
        }
        .bhrt-symptom-icon {
          transition: background 0.18s ease, color 0.18s ease;
        }
        .bhrt-symptom-row.active .bhrt-symptom-icon {
          background: rgba(78,205,196,0.16);
          color: var(--soft-teal);
        }
        .bhrt-check-dot {
          transition: all 0.18s ease;
        }
        .bhrt-symptom-row.active .bhrt-check-dot {
          background: var(--teal);
          border-color: var(--teal);
          color: var(--navy);
        }
        .bhrt-guidance-box {
          display: none;
        }
        .bhrt-guidance-box.show {
          display: block;
          animation: bhrtRiseIn 0.26s ease both;
        }
        @keyframes bhrtRiseIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .bhrt-s4 {
          background: #fff;
          padding: 48px 24px;
        }
        @media (min-width: 1024px) {
          .bhrt-s4 { padding: 80px 5vw; }
        }
        .bhrt-s5 {
          background: linear-gradient(160deg, #1a5c6e, #0a2540);
          padding: 48px 24px 56px;
          text-align: center;
        }
        @media (min-width: 1024px) {
          .bhrt-s5 { padding: 80px 5vw; }
        }
      `}</style>

      <div className="grid grid-cols-1 lg:grid-cols-2">
        {/* SECTION 1: Hero / Intro */}
        <div className="bhrt-s1">
          <div className="max-w-lg mx-auto lg:ml-auto lg:mr-8 xl:mr-16 relative z-10 w-full">
            {/* Desktop-only spacing/font adjustments added via lg: classes to fill space gracefully */}
            <div className="text-[10px] md:text-xs lg:text-sm font-medium tracking-[2.5px] uppercase text-[#4ecdc4] mb-4 md:mb-6 lg:mb-8">
              Restore your natural balance with
            </div>
            
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl xl:text-6xl leading-[1.1] text-white mb-6 lg:mb-10">
              Bioidentical Hormone Replacement<br />
              Therapy (BHRT).
            </h2>
            
            <div className="mb-8 md:mb-10 lg:mb-12">
              <h3 className="text-[#7ee8e2] text-sm md:text-base lg:text-lg font-semibold mb-2 lg:mb-3">What is it?</h3>
              <p className="text-xs md:text-sm lg:text-base text-white/80 leading-[1.6] lg:leading-[1.7] font-light">
                BHRT uses hormones that are structurally identical to hormones naturally produced by the body. Hormone therapy may be considered for appropriate patients after an individualized medical evaluation and discussion of potential benefits, risks, and alternatives.
              </p>
            </div>
            
            <div className="pt-6 md:pt-8 lg:pt-10 border-t border-white/10">
              <h3 className="font-serif text-2xl md:text-3xl lg:text-4xl text-white mb-3 lg:mb-4">
                Feel like <em className="italic text-[#7ee8e2]">yourself</em> again.
              </h3>
              <p className="text-xs md:text-sm lg:text-base text-white/70 leading-[1.6] lg:leading-[1.7] mb-6 md:mb-8 lg:mb-0 font-light">
                When hormone levels shift, it can affect how you feel every day. Fatigue, poor sleep, weight changes, and brain fog may be signals worth discussing with a trained provider.
              </p>
              {/* Mobile version button preserved, hidden on desktop */}
              <button
                onClick={scrollToListen}
                className="lg:hidden inline-flex items-center gap-2 bg-[#4ecdc4] text-[#0a2540] text-[11px] md:text-sm font-semibold tracking-[0.5px] px-5 py-3 md:px-6 md:py-3.5 rounded-full border-none cursor-pointer transition-transform duration-200 hover:bg-[#7ee8e2] active:scale-95"
              >
                <span>Start with your symptoms ↓</span>
              </button>
            </div>
          </div>
        </div>

        {/* SECTION 2: Listen to Your Body */}
        <div className="bhrt-s2" id="listenSection">
          <div className="max-w-lg mx-auto lg:mr-auto lg:ml-8 xl:ml-16 relative z-10 w-full">
            <div className="inline-flex items-center gap-2 text-[9px] md:text-xs font-semibold tracking-[2.6px] uppercase text-[#1a5c6e] mb-3">
              <span className="w-[7px] h-[7px] rounded-full bg-[#4ecdc4] shadow-[0_0_0_5px_rgba(78,205,196,0.18)] block"></span>
              Listen to your body
            </div>
            <h2 className="font-serif text-[29px] md:text-4xl leading-[1.08] text-[#0a2540] mb-2 tracking-[-0.4px]">
              Your symptoms may be <em className="text-[#1a5c6e] italic">signals</em>.
            </h2>
            <p className="text-[11px] md:text-sm text-[#5d6874] leading-[1.62] mb-5 font-light">
              Select what feels familiar. This is not a diagnosis — it is a simple way to start a more informed conversation with a trained provider.
            </p>

            <div className="grid grid-cols-[74px_1fr] md:grid-cols-[90px_1fr] gap-3.5 md:gap-5 items-center bg-white/70 border border-[#1a5c6e]/10 rounded-[22px] p-3.5 md:p-5 shadow-[0_16px_34px_rgba(10,37,64,0.08)] mb-4 backdrop-blur-md">
              <div
                className="bhrt-signal-ring w-[72px] h-[72px] md:w-[84px] md:h-[84px] rounded-full grid place-items-center"
                style={{ '--progress': `${progressDeg}deg` } as React.CSSProperties}
              >
                <div className="w-[56px] h-[56px] md:w-[66px] md:h-[66px] rounded-full grid place-items-center bg-[#0a2540] text-[#7ee8e2] font-serif text-[25px] md:text-3xl font-semibold leading-none">
                  <span>{activeCount}</span>
                </div>
              </div>
              <div>
                <h3 className="text-xs md:text-sm font-semibold text-[#0a2540] mb-1">{signalTitle}</h3>
                <p className="text-[10px] md:text-xs leading-[1.55] text-[#64707b] font-light">
                  {signalText}
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-[9px] mb-4">
              {symptoms.map((sym) => {
                const isActive = activeSymptoms.includes(sym.id);
                return (
                  <button
                    key={sym.id}
                    type="button"
                    onClick={() => toggleSymptom(sym.id)}
                    className={`bhrt-symptom-row grid grid-cols-[38px_1fr_22px] md:grid-cols-[48px_1fr_24px] items-center gap-2.5 md:gap-4 w-full border rounded-2xl p-2.5 md:p-3.5 text-left ${
                      isActive
                        ? 'active bg-[#0a2540] border-[#0a2540] shadow-[0_13px_26px_rgba(10,37,64,0.16)]'
                        : 'bg-white/75 border-[#1a5c6e]/10 shadow-[0_7px_18px_rgba(10,37,64,0.045)]'
                    }`}
                  >
                    <span
                      className={`bhrt-symptom-icon w-[38px] h-[38px] md:w-[48px] md:h-[48px] rounded-[13px] grid place-items-center ${
                        isActive ? 'bg-[#4ecdc4]/15 text-[#7ee8e2]' : 'bg-[#edf6f5] text-[#1a5c6e]'
                      }`}
                    >
                      {sym.icon}
                    </span>
                    <span className="flex flex-col">
                      <strong className={`text-[11.5px] md:text-sm font-semibold mb-0.5 ${isActive ? 'text-white' : 'text-[#0a2540]'}`}>
                        {sym.title}
                      </strong>
                      <span className={`text-[9.5px] md:text-xs font-light leading-[1.35] ${isActive ? 'text-white/60' : 'text-[#78838d]'}`}>
                        {sym.desc}
                      </span>
                    </span>
                    <span
                      className={`bhrt-check-dot w-5 h-5 md:w-6 md:h-6 rounded-full border grid place-items-center text-[11px] md:text-xs font-bold ${
                        isActive
                          ? 'bg-[#4ecdc4] border-[#4ecdc4] text-[#0a2540]'
                          : 'border-[#1a5c6e]/20 text-transparent'
                      }`}
                    >
                      ✓
                    </span>
                  </button>
                );
              })}
            </div>

            <div
              className={`bhrt-guidance-box relative overflow-hidden rounded-[18px] bg-gradient-to-br from-[#0a2540] to-[#123f54] p-4 md:p-5 border border-[#4ecdc4]/20 shadow-[0_18px_36px_rgba(10,37,64,0.16)] ${
                activeCount >= 1 ? 'show' : ''
              }`}
            >
              <div className="absolute -right-7 -top-7 w-[92px] h-[92px] bg-[#4ecdc4]/15 rounded-full pointer-events-none"></div>
              <div className="relative text-[9px] md:text-[10px] font-semibold tracking-[1.6px] uppercase text-[#7ee8e2] mb-1.5">
                Recommended next step
              </div>
              <p className="relative text-[10.5px] md:text-xs text-white/70 leading-[1.62] font-light mb-3">
                <strong className="text-white font-semibold">These symptoms can be associated with hormone changes.</strong> A provider-guided evaluation can help determine whether BHRT pellet therapy is appropriate for you.
              </p>
              <button
                type="button"
                onClick={() => window.open('https://healow.com/apps/provider/moises-issa-2847656', '_blank')}
                className="relative w-full border-0 rounded-full bg-[#4ecdc4] text-[#0a2540] text-[11px] md:text-sm font-semibold py-3 px-3.5 cursor-pointer hover:bg-[#7ee8e2] transition-colors"
              >
                Talk to our team →
              </button>
            </div>

            <p className="mt-3 text-[8.8px] md:text-[10px] text-[#7f8a94] leading-[1.45] font-light">
              Hormone therapy is not appropriate for everyone. A consultation and medical evaluation are required to review eligibility, benefits, and risks.
            </p>
          </div>
        </div>
      </div>

      {/* SECTION 3: Stats */}
      <div className="bhrt-s4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8 md:mb-12">
            <div className="text-[9px] md:text-xs font-medium tracking-[3px] uppercase text-[#1a5c6e] mb-2.5">
              Why it matters
            </div>
            <h2 className="font-serif text-[26px] md:text-4xl leading-[1.15] text-[#0a2540] mb-3">
              Hormone changes can start earlier than expected
            </h2>
            <p className="text-[11px] md:text-sm text-[#666] leading-[1.6] font-light max-w-2xl mx-auto">
              Many adults notice changes in energy, sleep, mood, weight, or libido before they know hormones may be involved.
            </p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5">
            <div className="bg-[#f8f6f1] rounded-[14px] p-4 md:p-6 text-center">
              <div className="font-serif text-[30px] md:text-4xl font-semibold text-[#0a2540] leading-none mb-1">
                <span className="text-[#1a5c6e]">30s–40s</span>
              </div>
              <div className="text-[9.5px] md:text-xs text-[#888] leading-[1.4] font-light">
                Testosterone levels may begin a gradual age-related decline during this period.
              </div>
            </div>
            <div className="bg-[#f8f6f1] rounded-[14px] p-4 md:p-6 text-center">
              <div className="font-serif text-[30px] md:text-4xl font-semibold text-[#0a2540] leading-none mb-1">
                <span className="text-[#1a5c6e]">45–55</span>
              </div>
              <div className="text-[9.5px] md:text-xs text-[#888] leading-[1.4] font-light">
                Typical age range when the menopausal transition begins for many women.
              </div>
            </div>
            <div className="bg-[#f8f6f1] rounded-[14px] p-4 md:p-6 text-center">
              <div className="font-serif text-[30px] md:text-4xl font-semibold text-[#0a2540] leading-none mb-1">
                <span className="text-[#1a5c6e]">1–2%</span>
              </div>
              <div className="text-[9.5px] md:text-xs text-[#888] leading-[1.4] font-light">
                Approximate annual testosterone decline described by current EvexiPEL information.
              </div>
            </div>
            <div className="bg-[#f8f6f1] rounded-[14px] p-4 md:p-6 text-center">
              <div className="font-serif text-[30px] md:text-4xl font-semibold text-[#0a2540] leading-none mb-1">
                <span className="text-[#1a5c6e]">Up to 10yr</span>
              </div>
              <div className="text-[9.5px] md:text-xs text-[#888] leading-[1.4] font-light">
                The menopausal transition and related symptoms can develop gradually and vary widely.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 4: CTA */}
      <div className="bhrt-s5">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-serif text-[28px] md:text-4xl text-white leading-[1.2] mb-2">
            Your body deserves<br />a <em className="italic text-[#7ee8e2]">personalized</em> answer.
          </h2>
          <p className="text-[11px] md:text-sm text-white/60 mb-6 md:mb-8 font-light leading-[1.6] max-w-md mx-auto">
            Speak with a trained EvexiPEL provider to learn whether BHRT pellet therapy may be right for you.
          </p>
          <Link
            to="/services/evexias-hormone-pellet-therapy"
            className="block bg-[#4ecdc4] text-[#0a2540] text-xs md:text-sm font-semibold py-3.5 px-4 rounded-full border-none cursor-pointer w-full max-w-sm mx-auto mb-3 tracking-[0.3px] hover:bg-[#7ee8e2] transition-colors"
          >
            Learn About EvexiPEL →
          </Link>
          <span
            className="text-[10px] md:text-xs text-white/50 underline cursor-pointer hover:text-white/80 transition-colors"
            onClick={() => document.getElementById('providers')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Ask our team about eligibility
          </span>
        </div>
      </div>
    </section>
  );
}
