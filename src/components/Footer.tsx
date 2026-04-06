import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Github, Linkedin, Mail, Shield, Users, FileText, HelpCircle, ArrowUp, MessageCircle, BookOpen } from 'lucide-react';

export const Footer: React.FC = () => {
  const navigate = useNavigate();

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-black border-t border-white/10 mt-auto w-full">
      <div className="w-full mx-auto px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 w-full">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <img
                src="/favicon.ico"
                alt="NewsScope Logo"
                className="w-6 h-6"
              />
              <span className="text-xl font-bold text-white">NewsScope</span>
            </div>
            <p className="text-sm text-white/70 max-w-xs">
              Advanced AI-powered news detection platform helping you identify authentic news from misinformation.
            </p>
            <div className="flex space-x-3">
              <a
                href="https://github.com/rohillamanas06-commits"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg border border-white/30 hover:bg-white/10 transition-colors text-white"
              >
                <Github className="h-4 w-4" />
              </a>
              <a
                href="https://www.linkedin.com/in/manas-rohilla-b73415338/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg border border-white/30 hover:bg-white/10 transition-colors text-white"
              >
                <Linkedin className="h-4 w-4" />
              </a>
              <a
                href="mailto:rohillamanas06@gmail.com"
                className="p-2 rounded-lg border border-white/30 hover:bg-white/10 transition-colors text-white"
              >
                <Mail className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Product Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-normal text-white" style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}>Product</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  onClick={() => handleNavigation('/detect')}
                  className="text-white/70 hover:text-white transition-colors flex items-center gap-2"
                >
                  <Shield className="h-4 w-4" />
                  Detect News
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavigation('/learn')}
                  className="text-white/70 hover:text-white transition-colors flex items-center gap-2"
                >
                  <BookOpen className="h-4 w-4" />
                  Learn
                </button>
              </li>
            </ul>
          </div>

          {/* Company Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-normal text-white" style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}>Company</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  onClick={() => handleNavigation('/about')}
                  className="text-white/70 hover:text-white transition-colors flex items-center gap-2"
                >
                  <Users className="h-4 w-4" />
                  About
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavigation('/contact')}
                  className="text-white/70 hover:text-white transition-colors flex items-center gap-2"
                >
                  <MessageCircle className="h-4 w-4" />
                  Contact
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavigation('/faq')}
                  className="text-white/70 hover:text-white transition-colors flex items-center gap-2"
                >
                  <HelpCircle className="h-4 w-4" />
                  FAQ
                </button>
              </li>
            </ul>
          </div>

          {/* Legal Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-normal text-white" style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}>Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  onClick={() => handleNavigation('/terms')}
                  className="text-white/70 hover:text-white transition-colors flex items-center gap-2"
                >
                  <FileText className="h-4 w-4" />
                  Terms of Service
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavigation('/privacy')}
                  className="text-white/70 hover:text-white transition-colors flex items-center gap-2"
                >
                  <Shield className="h-4 w-4" />
                  Privacy Policy
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t border-white/10 w-full">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-white/70">
              &copy; 2026 NewsScope. All rights reserved.
            </p>
            <button
              onClick={scrollToTop}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-white/30 hover:bg-white/10 transition-colors text-sm text-white"
            >
              <ArrowUp className="h-4 w-4" />
              Back to Top
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};