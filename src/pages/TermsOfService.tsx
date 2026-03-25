import { motion } from "motion/react";
import { Shield, FileText, Scale, Info } from "lucide-react";

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-primary-950 pt-32 pb-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16 text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent-500/10 border border-accent-500/20 text-accent-400 text-sm font-bold mb-6 uppercase tracking-widest">
            <Scale className="w-4 h-4" />
            Legal Documentation
          </div>
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-white mb-6">
            Terms of Service
          </h1>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">
            Please read these terms carefully before using our services. By accessing our website or services, you agree to be bound by these terms.
          </p>
        </motion.div>

        {/* Content */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="space-y-12 text-white/80 leading-relaxed"
        >
          <section className="bg-white/5 rounded-3xl p-8 md:p-12 border border-white/10">
            <h2 className="text-2xl font-serif font-bold text-white mb-6 flex items-center gap-3">
              <Info className="w-6 h-6 text-accent-400" />
              1. Acceptance of Terms
            </h2>
            <p className="mb-4">
              By accessing and using the website of Primary Medical Physicians ("we," "us," or "our"), you accept and agree to be bound by the terms and provision of this agreement. In addition, when using these particular services, you shall be subject to any posted guidelines or rules applicable to such services.
            </p>
            <p>
              Any participation in this service will constitute acceptance of this agreement. If you do not agree to abide by the above, please do not use this service.
            </p>
          </section>

          <section className="bg-white/5 rounded-3xl p-8 md:p-12 border border-white/10">
            <h2 className="text-2xl font-serif font-bold text-white mb-6 flex items-center gap-3">
              <Shield className="w-6 h-6 text-accent-400" />
              2. Medical Disclaimer
            </h2>
            <div className="p-6 rounded-2xl bg-accent-500/5 border border-accent-500/20 mb-6">
              <p className="text-accent-400 font-bold mb-2 uppercase tracking-widest text-xs">Important Notice</p>
              <p className="text-white font-medium">
                The content on this website is for informational purposes only and is not intended as medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.
              </p>
            </div>
            <p>
              Never disregard professional medical advice or delay in seeking it because of something you have read on this website. If you think you may have a medical emergency, call your doctor or 911 immediately.
            </p>
          </section>

          <section className="bg-white/5 rounded-3xl p-8 md:p-12 border border-white/10">
            <h2 className="text-2xl font-serif font-bold text-white mb-6 flex items-center gap-3">
              <FileText className="w-6 h-6 text-accent-400" />
              3. SMS & Communication Terms
            </h2>
            <p className="mb-6">
              By providing your mobile number, you consent to receive communications from Primary Medical Physicians, including appointment reminders, health updates, and administrative notifications via SMS/text messages.
            </p>
            <ul className="space-y-4 list-none">
              {[
                "Message and data rates may apply.",
                "Message frequency varies based on your interactions and health needs.",
                "You can opt-out at any time by replying 'STOP' to any message.",
                "For help, reply 'HELP' or contact our office directly.",
                "Mobile numbers provided for SMS consent will not be shared with third parties or affiliates for marketing purposes."
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent-500 mt-2.5 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="bg-white/5 rounded-3xl p-8 md:p-12 border border-white/10">
            <h2 className="text-2xl font-serif font-bold text-white mb-6 flex items-center gap-3">
              <Scale className="w-6 h-6 text-accent-400" />
              4. Limitation of Liability
            </h2>
            <p>
              Primary Medical Physicians and its components, as well as its providers and staff, shall not be responsible or liable for the accuracy, usefulness, or availability of any information transmitted or made available via the site, and shall not be responsible or liable for any error or omissions in that information.
            </p>
          </section>

          <div className="text-center pt-12">
            <p className="text-white/40 text-sm">
              Last Updated: March 25, 2026
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
