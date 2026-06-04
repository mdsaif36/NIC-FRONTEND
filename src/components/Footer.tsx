import { MessageCircle, Globe, ExternalLink } from 'lucide-react';

interface FooterLinkProps {
  href: string;
  label: string;
  id: string;
}

const FooterLink: React.FC<FooterLinkProps> = ({ href, label, id }) => (
  <li>
    <a
      id={id}
      href={href}
      className="text-gray-400 hover:text-white transition-colors duration-300 ease-in-out text-sm font-medium"
    >
      {label}
    </a>
  </li>
);

interface FooterColumnProps {
  title: string;
  links: { href: string; label: string; id: string }[];
}

const FooterColumn: React.FC<FooterColumnProps> = ({ title, links }) => (
  <div>
    <h4 className="font-sora text-xs font-semibold text-white uppercase tracking-wider mb-5">
      {title}
    </h4>
    <ul className="space-y-3">
      {links.map((link) => (
        <FooterLink key={link.id} {...link} />
      ))}
    </ul>
  </div>
);

const socialLinks = [
  {
    id: 'footer-social-discord',
    href: '#',
    label: 'Discord',
    icon: MessageCircle,
  },
  {
    id: 'footer-social-website',
    href: '#',
    label: 'Website',
    icon: Globe,
  },
  {
    id: 'footer-social-linkedin',
    href: '#',
    label: 'LinkedIn',
    icon: ExternalLink,
  },
];

const studentLinks = [
  { href: '#hero', label: 'Home', id: 'footer-link-home' },
  { href: '#how-it-works', label: 'How It Works', id: 'footer-link-how-it-works' },
  { href: '#about', label: 'About', id: 'footer-link-about' },
];

const alumniLinks = [
  { href: '#', label: 'Become a Mentor', id: 'footer-link-become-mentor' },
  { href: '#', label: 'Give Referrals', id: 'footer-link-give-referrals' },
  { href: '#', label: 'Dashboard', id: 'footer-link-dashboard' },
];

const legalLinks = [
  { href: '#', label: 'Privacy Policy', id: 'footer-link-privacy-policy' },
  { href: '#', label: 'Terms of Service', id: 'footer-link-terms-of-service' },
  { href: '#', label: 'Contact Us', id: 'footer-link-contact-us' },
];

export const Footer: React.FC = () => {
  return (
    <footer
      id="footer"
      className="relative bg-black border-t border-white/5 text-gray-400 font-inter py-16"
    >
      {/* Neon border line at the top of the footer */}
      <div className="absolute top-0 left-0 right-0 h-[1.2px] bg-gradient-to-r from-blue-500 to-red-500 shadow-[0_1px_15px_rgba(26,107,245,0.4)] pointer-events-none" />
      <div className="max-w-7xl mx-auto px-6">
        {/* Main grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Column 1: About NiC */}
          <div className="flex flex-col justify-between gap-6">
            <div>
              <div className="mb-5 flex items-center gap-2 group">
                <svg viewBox="0 0 160 100" className="w-8 h-8 select-none" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <linearGradient id="logo-grad-ni-footer" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#38BDF8" />
                      <stop offset="100%" stopColor="#8B5CF6" />
                    </linearGradient>
                    <linearGradient id="logo-grad-c-footer" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#38BDF8" />
                      <stop offset="100%" stopColor="#4F46E5" />
                    </linearGradient>
                  </defs>
                  <path d="M 25 65 L 25 36 C 25 22, 45 22, 45 30 L 60 50" stroke="url(#logo-grad-ni-footer)" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M 38 48 L 53 68 C 58 74, 68 74, 68 64 L 68 36" stroke="url(#logo-grad-ni-footer)" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx="68" cy="20" r="6" fill="#38BDF8" />
                  <path d="M 130 35 A 21.2 21.2 0 1 0 130 65" stroke="url(#logo-grad-c-footer)" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <div className="flex flex-col">
                  <span className="font-sora text-sm font-bold text-white tracking-tight leading-none">
                    NiC
                  </span>
                  <span className="text-[10px] text-transparent bg-clip-text bg-gradient-to-r from-[#FF1E3C] to-[#1E40FF] tracking-wider uppercase font-extrabold mt-0.5">
                    NextInCampus
                  </span>
                </div>
              </div>
              <p className="text-sm text-gray-400 leading-relaxed mb-6 max-w-xs">
                Your next opportunity starts with someone who walked before you.
              </p>
            </div>

            {/* Social links */}
            <div className="flex items-center gap-3">
              {socialLinks.map(({ id, href, label, icon: Icon }) => (
                <a
                  key={id}
                  id={id}
                  href={href}
                  aria-label={label}
                  className="flex items-center justify-center w-10 h-10 rounded-full border border-white/10 bg-white/5 text-gray-400 hover:border-nic-blue hover:bg-nic-blue hover:text-white transition-all duration-300 ease-in-out"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: For Students */}
          <FooterColumn title="For Students" links={studentLinks} />

          {/* Column 3: For Alumni */}
          <FooterColumn title="For Alumni" links={alumniLinks} />

          {/* Column 4: Legal */}
          <FooterColumn title="Legal" links={legalLinks} />
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/5 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-500">
            <p className="text-center md:text-left">
              © {new Date().getFullYear()} NextInCampus. All rights reserved.
            </p>
            <p className="text-center md:text-right">
              Empowering next-gen leaders through peer mentorship.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
