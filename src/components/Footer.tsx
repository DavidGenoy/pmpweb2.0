import {
  Facebook,
  Instagram,
  Twitter,
  MapPin,
  Phone,
  Mail,
} from "lucide-react";
import ChromaticLink from "./ChromaticLink";

export default function Footer() {
  return (
    <footer className="bg-transparent text-white pt-24 pb-12 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 reveal-up">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 bg-accent-500/10 blur-md rounded-full" />
                <img 
                  src="https://nethingso.xyz/img/Logo_PMP_transparent_highres_2x.png" 
                  alt="Primary Medical Physicians" 
                  className="h-10 w-auto relative z-10 brightness-0 invert"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
            <p className="text-white/70 leading-relaxed text-sm">
              Providing comprehensive, compassionate primary care to the Broward
              County community through our 16 expert providers across 7
              convenient locations.
            </p>
            <div className="flex items-center gap-4">
              <a
                href="https://www.facebook.com/p/Primary-Medical-Physicians-100092598885612/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/5 hover:bg-accent-500 flex items-center justify-center text-white hover:text-primary-900 transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="https://www.instagram.com/primarymedicalphysicians/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/5 hover:bg-accent-500 flex items-center justify-center text-white hover:text-primary-900 transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-lg mb-6 text-white">Quick Links</h4>
            <ul className="space-y-4">
              {[
                { name: "About Us", href: "#about" },
                { name: "Our Providers", href: "#providers" },
                { name: "Services", href: "#services" },
                { name: "Patient Portal", href: "https://health.healow.com/PMP", external: true },
                { name: "Contact Us", href: "#contact" },
              ].map((link) => (
                <li key={link.name}>
                  <ChromaticLink
                    href={link.href}
                    target={link.external ? "_blank" : undefined}
                    rel={link.external ? "noopener noreferrer" : undefined}
                    className="text-white/70 hover:text-accent-400 transition-colors text-sm font-medium"
                  >
                    {link.name}
                  </ChromaticLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Locations */}
          <div>
            <h4 className="font-bold text-lg mb-6 text-white">Our Locations</h4>
            <ul className="space-y-4">
              {[
                "Hollywood Taft (Main)",
                "Hollywood Johnson",
                "Pembroke Pines",
                "Davie Manor",
                "Davie",
                "Plantation",
                "Aventura",
              ].map((location) => (
                <li key={location}>
                  <ChromaticLink
                    href="#locations"
                    className="text-white/70 hover:text-accent-400 transition-colors text-sm font-medium flex items-center gap-2 flex-nowrap"
                  >
                    <MapPin className="w-4 h-4 shrink-0 text-accent-500/50" />
                    <span className="whitespace-nowrap">{location}</span>
                  </ChromaticLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold text-lg mb-6 text-white">Contact</h4>
            <ul className="space-y-4">
              <li>
                <ChromaticLink
                  href="tel:9543999014"
                  className="text-white/70 hover:text-accent-400 transition-colors text-sm font-medium flex items-center gap-3 flex-nowrap"
                >
                  <Phone className="w-5 h-5 shrink-0 text-accent-500" />
                  <span className="whitespace-nowrap">(954) 399-9014</span>
                </ChromaticLink>
              </li>
              <li>
                <ChromaticLink
                  href="mailto:info@pmpfla.com"
                  className="text-white/70 hover:text-accent-400 transition-colors text-sm font-medium flex items-center gap-3 flex-nowrap"
                >
                  <Mail className="w-5 h-5 shrink-0 text-accent-500" />
                  <span className="whitespace-nowrap">info@pmpfla.com</span>
                </ChromaticLink>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-white/50">
          <p>
            © {new Date().getFullYear()} Primary Medical Physicians. All rights
            reserved.
          </p>
          <div className="flex items-center gap-6">
            <ChromaticLink href="#" className="hover:text-white transition-colors">
              Privacy Policy
            </ChromaticLink>
            <ChromaticLink href="#" className="hover:text-white transition-colors">
              Terms of Service
            </ChromaticLink>
            <ChromaticLink href="#" className="hover:text-white transition-colors">
              HIPAA Notice
            </ChromaticLink>
          </div>
        </div>
      </div>
    </footer>
  );
}
