import { motion } from "motion/react";
import { Shield, Lock, Eye, FileCheck, Info } from "lucide-react";

export default function PrivacyPolicy() {
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
            <Lock className="w-4 h-4" />
            Privacy Commitment
          </div>
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-white mb-6">
            Privacy Policy
          </h1>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">
            Your privacy is of the utmost importance to us. This policy outlines how we handle, protect, and use your personal and medical information.
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
              <Shield className="w-6 h-6 text-accent-400" />
              1. Our Commitment to Privacy
            </h2>
            <p className="mb-4">
              Primary Medical Physicians is committed to maintaining the privacy and security of your personal and health information. We comply with all applicable laws, including the Health Insurance Portability and Accountability Act (HIPAA).
            </p>
            <p>
              This policy explains how we collect, use, and safeguard the information you provide to us through our website, patient portal, and other communication channels.
            </p>
          </section>

          <section className="bg-white/5 rounded-3xl p-8 md:p-12 border border-white/10">
            <h2 className="text-2xl font-serif font-bold text-white mb-6 flex items-center gap-3">
              <Eye className="w-6 h-6 text-accent-400" />
              2. Information We Collect
            </h2>
            <p className="mb-6">
              We may collect personal information including, but not limited to:
            </p>
            <ul className="space-y-4 list-none">
              {[
                "Name, address, and contact information (email, phone number).",
                "Demographic information (age, gender).",
                "Health-related information provided via forms or patient portal.",
                "Insurance and billing information.",
                "Technical data (IP address, browser type) when using our website."
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
              <Lock className="w-6 h-6 text-accent-400" />
              3. Mobile Number Protection
            </h2>
            <div className="p-6 rounded-2xl bg-accent-500/5 border border-accent-500/20 mb-6">
              <p className="text-accent-400 font-bold mb-2 uppercase tracking-widest text-xs">Strict Policy</p>
              <p className="text-white font-medium">
                Mobile numbers provided for SMS consent will not be shared with third parties or affiliates for marketing purposes.
              </p>
            </div>
            <p>
              We use your mobile number strictly for administrative and clinical purposes, such as appointment reminders and health notifications. We do not sell or rent your contact information to any third party.
            </p>
          </section>

          <section className="bg-white/5 rounded-3xl p-8 md:p-12 border border-white/10">
            <h2 className="text-2xl font-serif font-bold text-white mb-6 flex items-center gap-3">
              <FileCheck className="w-6 h-6 text-accent-400" />
              4. Data Sharing & Disclosure
            </h2>
            <p className="mb-4">
              We share your information only as necessary for treatment, payment, and healthcare operations, or as required by law.
            </p>
            <p>
              We do not share your personal data with third parties for their marketing purposes. Any data shared with service providers (e.g., billing companies, IT support) is protected by strict confidentiality agreements.
            </p>
          </section>

          <section className="bg-white/5 rounded-3xl p-8 md:p-12 border border-white/10">
            <h2 className="text-2xl font-serif font-bold text-white mb-6 flex items-center gap-3">
              <Info className="w-6 h-6 text-accent-400" />
              5. HIPAA Compliance
            </h2>
            <p>
              For a detailed explanation of how your Protected Health Information (PHI) is handled, please refer to our full HIPAA Notice of Privacy Practices, which is available upon request at any of our office locations.
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
