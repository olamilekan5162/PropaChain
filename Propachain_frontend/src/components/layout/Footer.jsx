import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="hidden md:block bg-gray-900 text-gray-300 py-8 md:py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-teal-700 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-lg">P</span>
              </div>
              <span className="text-xl font-bold text-white">PropaChain</span>
            </div>
            <p className="text-sm text-gray-400 mb-4">
              Nigeria's trusted blockchain-powered property marketplace.
            </p>
            <div className="flex gap-3">
              <a href="#" className="hover:text-white transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-white transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-white transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-white transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/marketplace"
                  className="hover:text-white transition-colors"
                >
                  Browse Properties
                </Link>
              </li>
              <li>
                <Link
                  to="/app/upload"
                  className="hover:text-white transition-colors"
                >
                  List Property
                </Link>
              </li>
              <li>
                <Link
                  to="/app/my-properties"
                  className="hover:text-white transition-colors"
                >
                  My Listings
                </Link>
              </li>
              <li>
                <Link
                  to="/app/profile"
                  className="hover:text-white transition-colors"
                >
                  My Account
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-white font-semibold mb-4">Categories</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/marketplace?category=houses-apartments"
                  className="hover:text-white transition-colors"
                >
                  Houses & Apartments
                </Link>
              </li>
              <li>
                <Link
                  to="/marketplace?category=land-plots"
                  className="hover:text-white transition-colors"
                >
                  Land & Plots
                </Link>
              </li>
              <li>
                <Link
                  to="/marketplace?category=commercial"
                  className="hover:text-white transition-colors"
                >
                  Commercial Property
                </Link>
              </li>
              <li>
                <Link
                  to="/marketplace?category=short-let"
                  className="hover:text-white transition-colors"
                >
                  Short Let
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-white font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="#" className="hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-400">
          <p>&copy; 2026 PropaChain. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
