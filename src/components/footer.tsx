import { Mail, Phone, Linkedin, Twitter } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-slate-900 dark:bg-black text-white py-12 md:py-16">
      <div className="max-w-6xl mx-auto px-4">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div>
            <h3 className="text-2xl font-bold mb-3">
              Agency<span className="text-primary">Hub</span>
            </h3>
            <p className="text-slate-400 text-sm mb-4">
              Connecting businesses with top-tier marketing agencies across the United States.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-slate-400 hover:text-primary transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="#" className="text-slate-400 hover:text-primary transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-slate-400 hover:text-primary text-sm transition-colors">
                  Browse Agencies
                </a>
              </li>
              <li>
                <a href="#" className="text-slate-400 hover:text-primary text-sm transition-colors">
                  Find by Service
                </a>
              </li>
              <li>
                <a href="#" className="text-slate-400 hover:text-primary text-sm transition-colors">
                  Top Rated
                </a>
              </li>
              <li>
                <a href="#" className="text-slate-400 hover:text-primary text-sm transition-colors">
                  Get Help
                </a>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold text-white mb-4">Company</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-slate-400 hover:text-primary text-sm transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="text-slate-400 hover:text-primary text-sm transition-colors">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="text-slate-400 hover:text-primary text-sm transition-colors">
                  Careers
                </a>
              </li>
              <li>
                <a href="#" className="text-slate-400 hover:text-primary text-sm transition-colors">
                  Press
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold text-white mb-4">Support</h4>
            <ul className="space-y-2">
              <li>
                <a href="mailto:support@agencyhub.com" className="text-slate-400 hover:text-primary text-sm transition-colors flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  support@agencyhub.com
                </a>
              </li>
              <li>
                <a href="tel:+1-555-123-4567" className="text-slate-400 hover:text-primary text-sm transition-colors flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  +1 (555) 123-4567
                </a>
              </li>
              <li>
                <a href="#" className="text-slate-400 hover:text-primary text-sm transition-colors">
                  Contact
                </a>
              </li>
              <li>
                <a href="#" className="text-slate-400 hover:text-primary text-sm transition-colors">
                  FAQ
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-800 my-8" />

        {/* Bottom Footer */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          <p className="text-slate-400 text-sm">
            &copy; {currentYear} AgencyHub. All rights reserved.
          </p>
          <div className="flex gap-6 justify-center md:justify-center">
            <a href="#" className="text-slate-400 hover:text-primary text-sm transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-slate-400 hover:text-primary text-sm transition-colors">
              Terms of Service
            </a>
            <a href="#" className="text-slate-400 hover:text-primary text-sm transition-colors">
              Cookie Policy
            </a>
          </div>
          <div className="text-slate-400 text-sm text-right hidden md:block">
            Made with care for agencies
          </div>
        </div>
      </div>
    </footer>
  );
}
