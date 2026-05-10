import { Github, Twitter, Instagram } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="border-t border-white/10 py-12 bg-slate-950/50 mt-20">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="col-span-2">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center font-bold text-white">
              S
            </div>
            <span className="text-lg font-bold tracking-tight text-white">
              SKYLINE<span className="text-primary-400">SHOP</span>
            </span>
          </div>
          <p className="text-slate-400 max-w-sm mb-6">
            Experience the future of e-commerce with our premium selection of curated goods.
            Designed for style, built for quality.
          </p>
          <div className="flex gap-4">
            <a href="#" className="p-2 glass rounded-lg hover:text-primary-400 transition-colors">
              <Github size={20} />
            </a>
            <a href="#" className="p-2 glass rounded-lg hover:text-primary-400 transition-colors">
              <Twitter size={20} />
            </a>
            <a href="#" className="p-2 glass rounded-lg hover:text-primary-400 transition-colors">
              <Instagram size={20} />
            </a>
          </div>
        </div>
        <div>
          <h4 className="font-bold text-white mb-6">Shop</h4>
          <ul className="space-y-4 text-slate-400 text-sm">
            <li>
              <a href="#" className="hover:text-white transition-colors">
                New Arrivals
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition-colors">
                Best Sellers
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition-colors">
                Exclusive Offers
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-white mb-6">Support</h4>
          <ul className="space-y-4 text-slate-400 text-sm">
            <li>
              <a href="#" className="hover:text-white transition-colors">
                Contact Us
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition-colors">
                Shipping Policy
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition-colors">
                FAQ
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 mt-12 pt-12 border-t border-white/5 text-center text-slate-500 text-xs">
        © 2024 SkylineShop. Built with React, Tailwind & SCSS.
      </div>
    </footer>
  );
};

export default Footer;
