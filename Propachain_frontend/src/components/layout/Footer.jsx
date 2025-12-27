import { Twitter, Github, Linkedin, Home } from "lucide-react";
import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="bg-zinc-900 text-zinc-300 py-16 border-t border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-teal-700 rounded-lg flex items-center justify-center">
                <Home className="text-white" size={24} />
              </div>
              <span className="text-2xl font-semibold text-white">
                PropaChain
              </span>
            </div>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Blockchain-powered real estate trading on Movement. Secure, fast,
              and transparent property transactions.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4 text-base">
              Platform
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  to="/marketplace"
                  className="hover:text-teal-400 transition-colors"
                >
                  Marketplace
                </Link>
              </li>
              <li>
                <Link to="/" className="hover:text-teal-400 transition-colors">
                  How it Works
                </Link>
              </li>
              <li>
                <a href="#" className="hover:text-teal-400 transition-colors">
                  Smart Contracts
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4 text-base">
              Resources
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <a href="#" className="hover:text-teal-400 transition-colors">
                  Documentation
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-teal-400 transition-colors">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-teal-400 transition-colors">
                  Community
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4 text-base">Connect</h4>
            <div className="flex space-x-4">
              <a
                href="#"
                className="w-10 h-10 bg-zinc-800 rounded-lg flex items-center justify-center hover:bg-teal-700 transition-colors"
              >
                <Twitter size={20} />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-zinc-800 rounded-lg flex items-center justify-center hover:bg-teal-700 transition-colors"
              >
                <Github size={20} />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-zinc-800 rounded-lg flex items-center justify-center hover:bg-teal-700 transition-colors"
              >
                <Linkedin size={20} />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-zinc-800 mt-12 pt-8 text-center">
          <p className="text-sm text-zinc-400">
            © {new Date().getFullYear()} PropaChain. All rights reserved. Built
            on Movement Blockchain.
          </p>
        </div>
      </div>
    </footer>
  );
};
